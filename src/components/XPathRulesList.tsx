import { Flex } from "antd";
import classes from "./list.module.css";
import { useSelector } from "react-redux";
import { getRulesOverrides } from "../store/parserSettings/parserSettingsSlice";
import { CreateXPathRuleForm } from "./CreateXPathRuleForm";
import { XmlParserRuleOverride } from "../models/rules";

export const XPathRulesList = () => {
  const overrideRules = useSelector(getRulesOverrides);

  return (
    <Flex vertical style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
      <Flex className={classes["list-item-container"]}>
        <CreateXPathRuleForm />
      </Flex>
      {overrideRules.toReversed().map((rule: XmlParserRuleOverride) => (
        <Flex key={rule.id} className={classes["list-item-container"]}>
          <CreateXPathRuleForm item={rule} />
        </Flex>
      ))}
    </Flex>
  );
};
