import { RcFile } from "antd/es/upload";
import { getFileContentAsTextAsync } from "./file";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";
import { DomXmlElement } from "../models/domXmlElement";
import { XmlParserTranslateRule, XmlParserWithinTextRule } from "../models/rules";

export const getXmlAsObjectAsync = async (
  file: RcFile
): Promise<{
    xmlRoot: XmlElement;
    xmlDocument: Document;
    translateRules: XmlParserTranslateRule[];
    withinTextRules: XmlParserWithinTextRule[];
}> => {
  const xml = await getFileContentAsTextAsync(file);
  const xmlDocument = new DOMParser().parseFromString(xml, file.type as DOMParserSupportedType);

  return {
    ...handleResult(xmlDocument.firstElementChild!),
    xmlDocument
  };
};

const handleResult = (node: DomXmlElement) => {
  const element = mapToXmlElement(node);
  const withinTextRules: XmlParserWithinTextRule[] = [];
  const translateRules: XmlParserTranslateRule[] = [];

  const addTranslateRule = (node: XmlElement) => translateRules.push({
    xpathSelector: buildXPathSelector(node.xmlNode),
    translate: "inherit"
  });

  const addWithinTextRule = (node: XmlElement) => withinTextRules.push({
    xpathSelector: buildXPathSelector(node.xmlNode),
    withinText: "yes"
  })

  autopopulateElementType(element, addTranslateRule, addWithinTextRule);

  return {
    xmlRoot: element,
    translateRules,
    withinTextRules
  };
};

const mapToXmlElement = (
  node: DomXmlElement,
  depth = 0,
  parent: XmlElement | null = null
): XmlElement => {
  if (isWhitespaceTextNode(node)) return null as unknown as XmlElement;
    if (depth == 0) console.log(node.firstChild);
  // create xmlElement
  var element: XmlElement = {
    name: node.nodeName,
    attributes: node.attributes
      ? [...node.attributes].map((entry) => ({
          key: entry.name,
          value: entry.nodeValue,
        }))
      : [],
    isText: node.nodeType == 3, // text type
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
}

const buildXPathSelector = (node: DomXmlElement) => {
    if (node.namespaceURI) {
        return `//*[local-name() = '${node.localName}' and namespace-uri() = '${node.namespaceURI}']`
    }

    return `//*[local-name() = '${node.localName}']`
}

const autopopulateElementType = (element: XmlElement, addTranslateRule: (node: XmlElement) => void, addWithinTextRule: (node: XmlElement) => void) => {
  const queue = [element];
  const processOrder: XmlElement[] = [];
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
  console.log("processOrder", processOrder, processOrder.length)
  processOrder.forEach((node) => {
    node.type = XmlElementType.Structural;
    const parent = node.parent;
    if (!parent) return;

    var isSiblingOfText = elementsWithInnerText.find((x) => x == parent);
    if (isSiblingOfText) {
      node.type = XmlElementType.Inline;
    }

    const isChildOfInlineParent = processOrder.find(
      (x) => x.type == XmlElementType.Inline && x.name == parent.name
    );

    if (isChildOfInlineParent) {
      node.type = XmlElementType.Inline;
    }

    if (node.type == XmlElementType.Inline) {
        addWithinTextRule(node);
    }

    addTranslateRule(node);
  });
};
