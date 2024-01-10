import { NodeType } from "../models/nodeType";
import { XmlElement } from "../models/xmlElement";
import { CDataNode } from "./CDataNode";
import { CommentNode } from "./CommentNode";
import ElementNode from "./ElementNode";
import { ProcessingInstructionNode } from "./ProcessingInstructionNode";
import { TextNode } from "./TextNode";
import { XmlNodeProps } from "./commonProps";

const rendererMap: { [key: number]: React.FC<XmlNodeProps> } = {
  [NodeType.Element]: ElementNode,
  [NodeType.Text]: TextNode,
  [NodeType.CDataSection]: CDataNode,
  [NodeType.Comment]: CommentNode,
  [NodeType.ProcessingInstruction]: ProcessingInstructionNode,
};

export const XmlRenderer = ({
  elements, ...rest
}: {
  elements: XmlElement[];
  [key: string]: any;
}) => {
  return (
    <>
      {elements.map((x) => {
        const Component = rendererMap[x.xmlNode.nodeType];

        return <Component element={x} {...rest}/>;
      })}
    </>
  );
};
