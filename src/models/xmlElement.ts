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
}

interface Attribute {
    key: string;
    value: any;
}