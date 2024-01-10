import { DomXmlElement } from "../models/domXmlElement";
import { NodeType } from "../models/nodeType";
import {
    XmlParserRule,
} from "../models/rules";
import { TranslateRule } from "../models/translateRule";
import { XmlDocument } from "../models/xmlDocument";
import { XmlElement } from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";

class XmlRuleApplier {
  public applyRules(
    xmlDocument: XmlDocument,
    document: Document,
    rules: XmlParserRule[]
  ) {
    this.setValuesBasedOnRules(document, rules);
    this.applyCascadingSettings(xmlDocument);
  }

  private setValuesBasedOnRules(document: Document, rules: XmlParserRule[]) {
    rules.forEach((rule) => {
        const nodes = this.evaluateXPath(document, rule.xpathSelector);
  
        nodes.forEach((node) => {
          if (!node.settings) {
            node.settings = {};
          }
          node.settings.translateSettingValue = rule.translate;
          node.settings.translateCurrentValue = rule.translate;
          node.settings.withinTextRuleValue = rule.withinText;
        });
      });
  }

  private applyCascadingSettings(xmlDocument: XmlDocument) {
    const defaultRule = this.getDefaultParserRule();

    xmlDocument.children.forEach(child => {
        this.cascadeSettings(child, defaultRule);
    });
  }

  private cascadeSettings(element: XmlElement, rule: Omit<XmlParserRule, "xpathSelector">) {
    if (!element.settings) return;

    const newRule = this.updateElementSettings(element, rule);

    element.children?.forEach(child => this.cascadeSettings(child, newRule));
  }

  private updateElementSettings(element: XmlElement, rule: Omit<XmlParserRule, "xpathSelector">): Omit<XmlParserRule, "xpathSelector"> {
    const newRule = {...rule};
    
    element.settings!.type = rule.isInline ? XmlElementType.Inline : XmlElementType.Structural;

    if (element.settings!.translateSettingValue == TranslateRule.Inherit) {
        element.settings!.translateCurrentValue = rule.translate;
    } else {
        newRule.translate = element.settings?.translateSettingValue;
    }

    // if (element.name == "para") {
    //     element.settings!.translateCurrentValue = TranslateRule.No;
    //     newRule.translate = TranslateRule.No;
    // }

    
    // if (element.name == "item") {
    //     element.settings!.translateCurrentValue = TranslateRule.Yes;
    //     newRule.translate = TranslateRule.Yes;
    // }

    return newRule;
  }

  private getDefaultParserRule(): Omit<XmlParserRule, "xpathSelector"> {
    return {
        isInline: false,
        translate: TranslateRule.Yes,
    };
  }

  private evaluateXPath(document: Document, xpath: string): XmlElement[] {
    const elements: XmlElement[] = [];
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ANY_TYPE,
      null
    );

    let current: DomXmlElement | null =
      result.iterateNext() as DomXmlElement | null;

    while (current) {
      elements.push(current.xmlElement!);
      current = result.iterateNext() as DomXmlElement | null;
    }

    return elements;
  }
}

export default new XmlRuleApplier();
