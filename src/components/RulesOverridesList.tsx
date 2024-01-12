import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button, Flex } from "antd";
import { RootState, useAppDispatch } from "../store";
import { AppContext } from "../context/AppContext";
import classes from "./rulesOverridesList.module.css";
import { XmlNodeActionPopoverContent } from "./popover/XmlNodeActionPopoverContent";
import { DeleteFilled } from "@ant-design/icons";
import { deleteRuleOverride } from "../store/parserSettings/parserSettingsSlice";

export const RulesOverridesList = () => {
  const { elementRuleMaps, overrides, defaultRules } = useSelector(
    (state: RootState) => state.parserSettings
  );
  const {
    appState: { xmlDocument },
  } = useContext(AppContext);
  const dispatch = useAppDispatch();

  const overrideRules = useMemo(() => {
    if (!xmlDocument) {
      return [];
    }

    return overrides
      .map((rule) => {
        const map = elementRuleMaps.find((x) => x.ruleId == rule.id)!;
        const xmlNode = xmlDocument!.getNodeById(map.xmlElementId);
        const defaultRule = defaultRules.find((x) => x.id == rule.id);

        return {
          ...defaultRule,
          ...rule,
          tagName: xmlNode?.name,
          element: xmlNode,
        };
      })
      .reverse();
  }, [overrides, defaultRules, elementRuleMaps, xmlDocument]);

  return (
    <Flex vertical style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
      {overrideRules.map((rule) => (
        <Flex key={rule.id} className={classes["list-item-container"]}>
          <Flex className={classes["list-item-column"]}>
            <span
              className={`${classes["list-item-tagName"]} ${
                rule.isInline ? classes.inlineTag : undefined
              }`}
            >{`<${rule.tagName}>`}</span>
          </Flex>
          <Flex className={classes["list-item-column"]}>
            <XmlNodeActionPopoverContent element={rule.element} />
          </Flex>
          <Flex className={classes["list-item-column"]}>
            <Button
              onClick={() => dispatch(deleteRuleOverride(rule.id))}
              icon={<DeleteFilled />}
              type="primary"
              danger
              shape="round"
            />
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
