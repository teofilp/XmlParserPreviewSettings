import { useContext } from "react";
import { Popover } from "antd";
import classes from "./popoverContent.module.css";
import { XmlElement } from "../../models/xmlElement";
import { AppContext } from "../../context/AppContext";
import { XmlElementType } from "../../models/xmlElementType";
import { TranslateRule } from "../../models/translateRule";
import { useXmlParserSettingsContext } from "../../context/XmlParserSettingsContext";
import { Flex } from "../Flex";

interface XmlNodeActionPopoverContentProps {
  element: XmlElement;
}

export const XmlNodeActionPopoverContent = ({
  element,
}: XmlNodeActionPopoverContentProps) => {
  const { getXmlElementRule, setRuleOverride } = useXmlParserSettingsContext();
  const xmlRule = getXmlElementRule(element);
  const { getElementSettings } = useContext(AppContext);
  const elementSettings = getElementSettings(element);

  console.log(xmlRule);
  
  const elementType = xmlRule.isInline
    ? XmlElementType.Inline
    : XmlElementType.Structural;
  const translate = elementSettings!.translateCurrentValue!;

  const translateActionMapper: {
    [key: string]: { tooltip: string; label: string; action: () => void };
  } = {
    [TranslateRule.No]: {
      tooltip: "Make translatable",
      label: "NT",
      action: () =>
        setRuleOverride({
          id: xmlRule.id,
          translate: TranslateRule.Yes,
          xpathSelector: xmlRule.xpathSelector,
        }),
    },
    [TranslateRule.Yes]: {
      tooltip: "Make nontranslatable",
      label: "T",
      action: () =>
        setRuleOverride({
          id: xmlRule.id,
          translate: TranslateRule.No,
          xpathSelector: xmlRule.xpathSelector,
        }),
    },
  };

  const elementTypeActionMapper: {
    [key: string]: { tooltip: string; label: string; action: () => void };
  } = {
    [XmlElementType.Inline]: {
      tooltip: "Make structural",
      label: "I",
      action: () =>
        setRuleOverride({
          id: xmlRule.id,
          isInline: false,
          xpathSelector: xmlRule.xpathSelector,
        }),
    },
    [XmlElementType.Structural]: {
      tooltip: "Make inline",
      label: "S",
      action: () =>
        setRuleOverride({
          id: xmlRule.id,
          isInline: true,
          xpathSelector: xmlRule.xpathSelector,
        }),
    },
  };

  return (
    <Flex style={{ gap: 8 }} dir="row">
      <Popover title={elementTypeActionMapper[elementType].tooltip}>
        <Flex
          onClick={elementTypeActionMapper[elementType].action}
          className={classes.actionButton}
        >
          {elementTypeActionMapper[elementType].label}
        </Flex>
      </Popover>
      <Popover title={translateActionMapper[translate]!.tooltip}>
        <Flex
          onClick={translateActionMapper[translate].action}
          className={classes.actionButton}
        >
          {translateActionMapper[translate].label}
        </Flex>
      </Popover>
    </Flex>
  );
};
