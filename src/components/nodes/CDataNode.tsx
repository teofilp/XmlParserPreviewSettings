import { XmlNode } from "./XmlNode";
import { XmlNodeProps } from "./commonProps";

export const CDataNode = ({ element }: XmlNodeProps) => {
 return <XmlNode className="cdata">
    {`<![CDATA[${element.textValue}]]>`}
 </XmlNode>   
}