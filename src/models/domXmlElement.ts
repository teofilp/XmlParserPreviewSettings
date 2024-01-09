import { XmlElement } from "./xmlElement";

export interface DomXmlElement extends Element {
    xmlElement?: XmlElement;
    xpathSelector?: string;
}