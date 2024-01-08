import { PropsWithChildren } from "react";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";

interface XmlElementProps {
  element: XmlElement;
}

const buildStartTagText = (element: XmlElement) => {
  const hasAttributes = element.attributes.length > 0;

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

const Indentation = ({
  depth,
  breakLine,
  children,
  style,
}: PropsWithChildren<any>) => {
  var paddingInlineStart = !breakLine ? 0 : depth * 6 + "px";

  return (
    <>
      {breakLine && <br />}
      <span
        style={{
          paddingInlineStart,
          display: "inline-block",
          ...style,
        }}
      >
        {children}
      </span>
    </>
  );
};

const XmlElementComponent = ({ element, children }: PropsWithChildren<XmlElementProps>) => {
  if (element.depth == 0) console.log(element);

  const breakLine = element.type == XmlElementType.Structural;
  const depth = element.depth;

  if (element.isText) {
    return (
      <Indentation depth={depth} isText>
        {element.textValue!}
      </Indentation>
    );
  }

  const startTag = buildStartTagText(element);
  const endTag = buildEndTagText(element);

  return (
    <Indentation breakLine={breakLine} depth={depth}>
      {startTag}
      {element.children &&
        element.children.map((child) => (
          <XmlElementComponent element={child} />
        ))}
        {breakLine && <br/>}
        {endTag}
    </Indentation>
  );
};

export default XmlElementComponent;
