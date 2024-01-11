import { TranslateRule } from "./translateRule";
import { WithinTextRule } from "./withinTextRule";

export interface XmlParserRule {
    id: string;
    translate?: TranslateRule;
    withinText?: WithinTextRule;
    isInline: boolean;
    xpathSelector: string;
}

export interface XmlParserRuleOverride {
    id: string;
    xpathSelector: string;
    translate?: TranslateRule;
    WithinTextRule?: WithinTextRule;
    isInline?: boolean;
}