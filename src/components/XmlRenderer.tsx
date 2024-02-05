import { NodeType } from "../models/nodeType";
import { XmlElement } from "../models/xmlElement";
import { CDataNode } from "./nodes/CDataNode";
import { CommentNode } from "./nodes/CommentNode";
import ElementNode from "./nodes/ElementNode";
import { ProcessingInstructionNode } from "./nodes/ProcessingInstructionNode";
import { TextNode } from "./nodes/TextNode";
import { XmlNodeProps } from "./nodes/commonProps";

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

        return <Component key={x.id} element={x} {...rest}/>;
      })}
    </>
  );
};
