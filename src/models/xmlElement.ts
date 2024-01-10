import { WithinTextRule } from "./withinTextRule";
import { DomXmlElement } from "./domXmlElement";
import { TranslateRule } from "./translateRule";
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
    settings?: XmlSettings;
}

interface Attribute {
    key: string;
    value: any;
}

interface XmlSettings {
    translateSettingValue?: TranslateRule;
    translateCurrentValue?: TranslateRule;
    withinTextRuleValue?: WithinTextRule,
    type?: XmlElementType;
}