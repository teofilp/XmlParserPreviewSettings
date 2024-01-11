import { XmlDocument } from "../models/xmlDocument";
import { XmlElement } from "../models/xmlElement";

export interface XmlNodeProps {
    element: XmlElement;
    [key: string]: any;
}