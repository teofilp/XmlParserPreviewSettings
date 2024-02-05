import { XmlNode } from "./XmlNode";
import { XmlNodeProps } from "./commonProps";

export const CommentNode = ({ element }: XmlNodeProps) => {
  return <XmlNode className="comment">{`<!--${element.textValue}-->`}</XmlNode>;
};
