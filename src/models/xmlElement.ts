import { DomXmlElement } from "./domXmlElement";
import { XmlElementType } from "./xmlElementType";

export interface XmlElement {
    name: string;
    attributes: Attribute[];
    children?: XmlElement[];
    isText: boolean;
    depth: number;
    parent: XmlElement | null;
    textValue?: string;
    type?: XmlElementType;
    xmlNode: DomXmlElement;
}

interface Attribute {
    key: string;
    value: any;
}