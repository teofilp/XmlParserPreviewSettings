import { RcFile } from "antd/es/upload";
import { parseStringPromise } from "xml2js";
import { getFileContentAsTextAsync } from "./file";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";

export const getXmlAsObjectAsync = async (
  file: RcFile
): Promise<XmlElement> => {
  var xml = await getFileContentAsTextAsync(file);

  return parseStringPromise(xml, {
    explicitRoot: false,
    trim: true,
    preserveChildrenOrder: true,
    charsAsChildren: true,
    explicitChildren: true,
    charkey: "textValue",
    attrkey: "attributes",
    childkey: "children",
  }).then(handleResult);
};

const handleResult = (node: any): XmlElement => {
  var element = mapToXmlElement(node);

  autopopulateElementType(element);
  console.log(element);
  return element;
};

const mapToXmlElement = (
  node: any,
  depth = 0,
  parent: XmlElement | null = null
): XmlElement => {
  if (depth == 0) console.log(node);
  var element: XmlElement = {
    name: node["#name"],
    attributes: Object.entries(node.attributes ?? []).map((entry) => ({
      key: entry[0],
      value: entry[1],
    })),
    isText: node["#name"] == "__text__",
    depth: depth,
    parent: parent,
    textValue: node.textValue,
  };

  element.children = node.children?.map((el: XmlElement) =>
    mapToXmlElement(el, depth + 1, element)
  );

  return element;
};

const autopopulateElementType = (element: XmlElement) => {
  const queue = [element];
  const processOrder: XmlElement[] = [];
  const elementsWithInnerText: XmlElement[] = [];

  while (queue.length > 0) {
    var current = queue.shift()!;

    if (!current.isText) {
      if (!processOrder.find((x) => x == current)) {
        processOrder.push(current);
      }
    } else if (current.parent) {
      elementsWithInnerText.push(current.parent);
    }

    current.children?.forEach((x) => queue.push(x));
  }

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
  });
};
