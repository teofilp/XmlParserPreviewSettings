import isNil from "lodash.isnil";
import { DomXmlElement } from "../models/domXmlElement";
import { XmlParserRule, XmlParserRuleOverride } from "../models/rules";
import { TranslateRule } from "../models/translateRule";
import { XmlDocument } from "../models/xmlDocument";
import {
  XmlElement,
  XmlElementRuleMap,
  XmlElementSettings,
} from "../models/xmlElement";
import { XmlElementType } from "../models/xmlElementType";

class XmlRuleApplier {
  private elementSettings: XmlElementSettings[] = [];
  private elementRuleMaps: XmlElementRuleMap[] = [];

  public applyRules(
    xmlDocument: XmlDocument,
    document: Document,
    rules: XmlParserRuleOverride[]
  ): {
    elementSettings: XmlElementSettings[];
    elementRuleMaps: XmlElementRuleMap[];
  } {
    this.elementSettings = [];
    this.elementRuleMaps = [];

    this.setValuesBasedOnRules(document, rules);
    this.applyCascadingSettings(xmlDocument);

    return {
      elementSettings: this.elementSettings,
      elementRuleMaps: this.elementRuleMaps,
    };
  }

  private setValuesBasedOnRules(
    document: Document,
    rules: XmlParserRuleOverride[]
  ) {
    rules.forEach((rule) => {
      const nodes = this.evaluateXPath(document, rule.xpathSelector);
      console.log(rule, nodes);

      nodes.forEach((node) => {
        this.addRuleMap(node, rule);

        const xmlSettings = this.getSettingForXmlElement(node);

        xmlSettings.translateSettingValue = rule.translate;
        // do not override if override does not contain value
        xmlSettings.translateCurrentValue = rule.translate
          ? rule.translate
          : xmlSettings.translateCurrentValue;
        xmlSettings.withinTextRuleValue = rule.withinTextRule
          ? rule.withinTextRule
          : xmlSettings.withinTextRuleValue;
        xmlSettings.type = !isNil(rule.isInline)
          ? rule.isInline
            ? XmlElementType.Inline
            : XmlElementType.Structural
          : xmlSettings.type;
      });
    });
  }

  private addRuleMap(node: XmlElement, rule: XmlParserRuleOverride) {
    this.elementRuleMaps.push({ xmlElementId: node.id, ruleId: rule.id });
  }

  private applyCascadingSettings(xmlDocument: XmlDocument) {
    const defaultRule = this.getDefaultParserRule();

    xmlDocument.getRootNodes().forEach((child) => {
      this.cascadeSettings(xmlDocument, child, defaultRule);
    });
  }

  private cascadeSettings(
    xmlDocument: XmlDocument,
    element: XmlElement,
    rule: Omit<XmlParserRuleOverride, "xpathSelector">
  ) {
    if (!this.elementSettingsExists(element)) return;

    const newRule = this.updateElementSettings(element, rule);

    xmlDocument
      .getChildrenOfNode(element)
      .forEach((child) => this.cascadeSettings(xmlDocument, child, newRule));
  }

  private updateElementSettings(
    element: XmlElement,
    rule: Omit<XmlParserRuleOverride, "xpathSelector">
  ): Omit<XmlParserRuleOverride, "xpathSelector"> {
    const newRule = { ...rule };
    const existingSettings = this.getSettingForXmlElement(element);

    if (existingSettings.translateSettingValue == TranslateRule.Inherit) {
      existingSettings.translateCurrentValue = rule.translate;
    } else {
      newRule.translate = existingSettings.translateSettingValue;
    }

    return newRule;
  }

  private getDefaultParserRule(): Omit<XmlParserRuleOverride, "xpathSelector"> {
    return {
      id: "",
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

  private getSettingForXmlElement(element: XmlElement): XmlElementSettings {
    const existingItem = this.elementSettings.find(
      (x) => x.elementId == element.id
    );

    if (existingItem) {
      return existingItem;
    }

    const newItem = {
      elementId: element.id,
    };

    this.elementSettings.push(newItem);

    return newItem;
  }

  private elementSettingsExists(element: XmlElement): boolean {
    return !!this.elementSettings.find((x) => x.elementId == element.id);
  }
}

export default new XmlRuleApplier();
