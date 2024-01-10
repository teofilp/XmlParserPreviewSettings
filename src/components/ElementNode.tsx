import { PropsWithChildren } from "react";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";
import { Indentation } from "./Indentation";
import { XmlNodeProps } from "./commonProps";
import { XmlRenderer } from "./XmlRenderer";
import { TranslateRule } from "../models/translateRule";

const buildStartTagText = (element: XmlElement) => {
  const hasAttributes = element.attributes.length > 0 && false; // remove attributes for now

  if (!hasAttributes) {
    return `<${element.name}>`;
  }

  const attributes = element.attributes
    .map((x) => `${x.key}="${x.value}"`)
    .join(" ");

  return `<${element.name}  ${attributes}>`;
};

const buildEndTagText = (element: XmlElement) => {
  return `</${element.name}>`;
};

const ElementNode = ({ element }: PropsWithChildren<XmlNodeProps>) => {
  if (element.depth == 0) console.log(element);

  const isInline = element.settings?.type == XmlElementType.Inline;
  const depth = element.depth;

  if (element.isText) {
    return <Indentation depth={depth}>{element.textValue!}</Indentation>;
  }

  const startTag = buildStartTagText(element);
  const endTag = buildEndTagText(element);

  return (
    <>
    <Indentation isInline={isInline} depth={depth}>
      {startTag}
      {element.children && (
        <XmlRenderer
          translatable={
            element.settings?.translateCurrentValue == TranslateRule.Yes
          }
          elements={element.children}
        />
      )}
      {endTag}
    </Indentation>
    </>
  );
};

export default ElementNode;
