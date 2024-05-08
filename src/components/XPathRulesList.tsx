import classes from "./list.module.css";
import { CreateXPathRuleForm } from "./CreateXPathRuleForm";
import { XmlParserRuleOverride } from "../models/rules";
import { useActiveNodesContext } from "../context/ActiveNodesContext";
import { useXmlParserSettingsContext } from "../context/XmlParserSettingsContext";
import { Flex } from "./Flex";

export const XPathRulesList = () => {
  const {
    state: { overrides },
  } = useXmlParserSettingsContext();
  const { setXPathSelector } = useActiveNodesContext();

  return (
    <Flex vertical style={{ width: "100%", marginTop: 16, marginBottom: 16 }}>
      <Flex className={classes["list-item-container"]}>
        <CreateXPathRuleForm />
      </Flex>
      {overrides.toReversed().map((rule: XmlParserRuleOverride) => (
        <Flex
          key={rule.id}
          onMouseOver={() => {
            setXPathSelector(rule.xpathSelector);
          }}
          onMouseOut={() => setXPathSelector("")}
          className={classes["list-item-container"]}
        >
          <CreateXPathRuleForm item={rule} />
        </Flex>
      ))}
    </Flex>
  );
};
