import { TranslateRule } from "./translateRule";
import { WithinTextRule } from "./withinTextRule";

export interface XmlParserRule {
    translate?: TranslateRule;
    withinText?: WithinTextRule;
    isInline: boolean;
    xpathSelector: string;
}