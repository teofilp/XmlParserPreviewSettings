import { WithinTextRule } from "./withinTextRule";
import { DomXmlElement } from "./domXmlElement";
import { TranslateRule } from "./translateRule";
import { XmlElementType } from "./xmlElementType";

export interface XmlElement {
    id: string;
    name: string;
    attributes: Attribute[];
    isText: boolean;
    depth: number;
    parentId: string | null;
    textValue?: string;
    type?: XmlElementType;
    xmlNode: DomXmlElement;
}

export interface XmlElementWithRelations extends XmlElement {
    parent: XmlElementWithRelations | null;
    children?: XmlElementWithRelations[];
}

interface Attribute {
    key: string;
    value: any;
}

export interface XmlElementSettings {
    elementId: string;
    translateSettingValue?: TranslateRule;
    translateCurrentValue?: TranslateRule;
    withinTextRuleValue?: WithinTextRule,
    type?: XmlElementType;
}

export interface XmlElementRuleMap {
    xmlElementId: string;
    ruleId: string;
}