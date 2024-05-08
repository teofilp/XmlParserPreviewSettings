import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { XmlParserRule, XmlParserRuleOverride } from "../models/rules";
import { XmlElement, XmlElementRuleMap } from "../models/xmlElement";

interface XmlParserSettings {
  defaultRules: XmlParserRule[];
  overrides: XmlParserRuleOverride[];
  elementRuleMaps: XmlElementRuleMap[];
}

const getDefaultXmlParserSettings = (): XmlParserSettings => ({
  defaultRules: [],
  overrides: [],
  elementRuleMaps: [],
});

const XmlParserSettingsContext = createContext({
  state: getDefaultXmlParserSettings(),
  setDefaultRules: (_: XmlParserRule[]) => {},
  setRulesMaps: (_: XmlElementRuleMap[]) => {},
  setRuleOverride: (_: XmlParserRuleOverride) => {},
  deleteRuleOverride: (_: string) => {},
  resetState: () => {},
  getXmlElementRule: (_: XmlElement): XmlParserRule =>
    null as never as XmlParserRule,
  applicableRules: [] as XmlParserRuleOverride[],
});

export const XmlParserSettingsContextProvider = ({
  children,
}: PropsWithChildren<any>) => {
  const [defaultRules, setDefaultRules] = useState<XmlParserRule[]>([]);
  const [overrides, setOverrrides] = useState<XmlParserRuleOverride[]>([]);
  const [elementRuleMaps, setRulesMaps] = useState<XmlElementRuleMap[]>([]);

  const setRuleOverride = (payload: XmlParserRuleOverride) => {
    const existingOverride = overrides.find((x) => x.id == payload.id);

    if (!existingOverride) {
      setOverrrides((old) => [...old, payload]);
      return;
    }

    setOverrrides((old) =>
      old.map((item) =>
        item.id == payload.id
          ? {
              ...item,
              ...payload,
            }
          : item
      )
    );
  };

  const deleteRuleOverride = (id: string) => {
    setOverrrides((old) => old.filter((x) => x.id !== id));
  };

  const resetState = () => {
    const defaultState = getDefaultXmlParserSettings();
    setDefaultRules(defaultState.defaultRules);
    setOverrrides(defaultState.overrides);
    setRulesMaps(defaultState.elementRuleMaps);
  };

  const getXmlElementRule = useCallback(
    (node: XmlElement): XmlParserRule => {
      const map = elementRuleMaps.find((x) => x.xmlElementId == node.id)!;

      const defaultRule = defaultRules.find((x) => x.id == map.ruleId)!;
      const ruleOverride = overrides.find((x) => x.id == map.ruleId);

      if (!ruleOverride) {
        return defaultRule;
      }

      return {
        ...defaultRule,
        ...ruleOverride,
      };
    },
    [defaultRules, overrides, elementRuleMaps]
  );

  const applicableRules = useMemo((): XmlParserRuleOverride[] => {
    const defaultRulesWithOverrides: XmlParserRuleOverride[] = defaultRules.map(
      (defaultRule) => {
        const override = overrides.find((o) => o.id == defaultRule.id);

        if (!override) {
          return defaultRule;
        }

        return {
          ...defaultRule,
          ...override,
        };
      }
    );

    const xpathRules = overrides.filter(
      (x) => !defaultRules.find((y) => y.id == x.id)
    );

    return defaultRulesWithOverrides.concat(...xpathRules);
  }, [defaultRules, overrides]);

  const value = {
    state: {
      defaultRules,
      overrides,
      elementRuleMaps,
    },
    setDefaultRules,
    setOverrrides,
    setRulesMaps,
    setRuleOverride,
    deleteRuleOverride,
    resetState,
    getXmlElementRule,
    applicableRules,
  };

  return (
    <XmlParserSettingsContext.Provider value={value}>
      {children}
    </XmlParserSettingsContext.Provider>
  );
};

export const useXmlParserSettingsContext = () =>
  useContext(XmlParserSettingsContext);
