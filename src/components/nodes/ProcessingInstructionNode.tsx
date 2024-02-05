import { XmlNode } from "./XmlNode";
import { XmlNodeProps } from "./commonProps";

export const ProcessingInstructionNode = ({ element }: XmlNodeProps) => {
  return <XmlNode className="processing-instruction">{`<?${element?.name || ""} ${element.textValue}?>`}</XmlNode>;
};
