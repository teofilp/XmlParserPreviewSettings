import { RcFile } from "antd/es/upload";
import { getFileContentAsTextAsync } from "./file";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";
import { DomXmlElement } from "../models/domXmlElement";
import {
    XmlParserRule,
} from "../models/rules";
import { NodeType } from "../models/nodeType";
import { XmlDocument } from "../models/xmlDocument";
import { TranslateRule } from "../models/translateRule";
import { WithinTextRule } from "../models/withinTextRule";

export const getXmlAsObjectAsync = async (
  file: RcFile
): Promise<{
  xmlDocument: XmlDocument;
  xmlDomDocument: Document;
  parserRules: XmlParserRule[];
}> => {
  const parserRules: XmlParserRule[] = [];

  const addParserRule = (rule: XmlParserRule) => {
    parserRules.push(rule);
  };

  const xml = await getFileContentAsTextAsync(file);
  const xmlDomDocument = new DOMParser().parseFromString(
    xml,
    file.type as DOMParserSupportedType
  );

  const xmlDocument = {
    children: ([...xmlDomDocument.childNodes] as DomXmlElement[])
      .map((x) => handleResult(x, addParserRule))
      .filter((x) => !!x),
  };

  console.log(xmlDocument);
  console.log(parserRules);

  return {
    xmlDocument,
    parserRules,
    xmlDomDocument,
  };
};

const handleResult = (
  node: DomXmlElement,
  addParserRule: any
) => {
  const element = mapToXmlElement(node);

  if (!element) {
    return element;
  }

  autopopulateElementType(element, addParserRule);

  return element;
};

const mapToXmlElement = (
  node: DomXmlElement,
  depth = 0,
  parent: XmlElement | null = null
): XmlElement => {
  if (isWhitespaceTextNode(node) || !nodeTypeIsValid(node))
    return null as unknown as XmlElement;

  // create xmlElement
  var element: XmlElement = {
    name: node.nodeName,
    attributes: node.attributes
      ? [...node.attributes].map((entry) => ({
          key: entry.name,
          value: entry.nodeValue,
        }))
      : [],
    isText: node.nodeType == NodeType.Text, // text type
    depth: depth,
    parent: parent,
    textValue: node.textContent ?? "",
    xmlNode: node,
  };

  // attach xmlElement to DomXmlElement node
  node.xmlElement = element;
  node.xpathSelector = buildXPathSelector(node);

  // map children
  element.children = [];
  for (var el of node.childNodes) {
    var xmlElement = mapToXmlElement(el as DomXmlElement, depth + 1, element);

    if (xmlElement != null) {
      element.children.push(xmlElement);
    }
  }

  return element;
};

const isWhitespaceTextNode = (node: DomXmlElement) => {
  return node.nodeType == 3 && /^\s*$/.test(node.nodeValue ?? "");
};

const nodeTypeIsValid = (node: DomXmlElement) => {
  return [
    NodeType.Element,
    NodeType.Text,
    NodeType.CDataSection,
    NodeType.Comment,
    NodeType.ProcessingInstruction,
  ].includes(node.nodeType);
};

const buildXPathSelector = (node: DomXmlElement) => {
  if (node.namespaceURI) {
    return `//*[local-name() = '${node.localName}' and namespace-uri() = '${node.namespaceURI}']`;
  }

  return `//*[local-name() = '${node.localName}']`;
};

const autopopulateElementType = (
  element: XmlElement,
  addParserRule: (rule: XmlParserRule) => void,
) => {
  const queue = [element];
  let processOrder: XmlElement[] = [];
  const elementsWithInnerText: XmlElement[] = [];

  while (queue.length > 0) {
    var current = queue.shift()!;

    if (!current.isText) {
      if (!processOrder.find((x) => x.name == current.name)) {
        processOrder.push(current);
      }
    } else if (current.parent) {
      elementsWithInnerText.push(current.parent);
    }

    current.children?.forEach((x) => queue.push(x));
  }

  // we are only interested in 
  processOrder = processOrder.filter((x) =>
    [NodeType.Element].includes(x.xmlNode.nodeType)
  );

  processOrder.forEach((node) => {
    const elementType = getElementType(node, elementsWithInnerText, processOrder);
    const xmlParserRule: XmlParserRule = {
        isInline: elementType == XmlElementType.Inline,
        xpathSelector: buildXPathSelector(node.xmlNode)
    }

    if (xmlParserRule.isInline) {
      xmlParserRule.withinText = WithinTextRule.Yes;
    }

    xmlParserRule.translate = TranslateRule.Inherit;
    addParserRule(xmlParserRule);
  });
};

const getElementType = (
  node: XmlElement,
  elementsWithInnerText: XmlElement[],
  processOrder: XmlElement[]
): XmlElementType => {
  const parent = node.parent;
  if (!parent) return XmlElementType.Structural;

  var isSiblingOfText = elementsWithInnerText.find((x) => x == parent);
  if (isSiblingOfText) {
    return XmlElementType.Inline;
  }

  const isChildOfInlineParent = processOrder.find(
    (x) => x.type == XmlElementType.Inline && x.name == parent.name
  );

  if (isChildOfInlineParent) {
    return XmlElementType.Inline;
  }

  return XmlElementType.Structural;
};
