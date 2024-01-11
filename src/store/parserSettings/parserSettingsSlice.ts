import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { XmlParserRule, XmlParserRuleOverride } from "../../models/rules";
import { XmlElement, XmlElementRuleMap } from "../../models/xmlElement";
import { RootState } from "..";

export interface XmlParserSettingsState {
  defaultRules: XmlParserRule[];
  overrides: XmlParserRuleOverride[];
  elementRuleMaps: XmlElementRuleMap[];
}

const getDefaultState = (): XmlParserSettingsState => ({
  defaultRules: [],
  overrides: [],
  elementRuleMaps: [],
});

export const parserSettingsSlice = createSlice({
  name: "parserSettings",
  initialState: getDefaultState(),
  reducers: {
    setDefaultRules: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserRule[]>
    ) => {
      state.defaultRules = payload;
    },
    setRulesMaps: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlElementRuleMap[]>
    ) => {
      state.elementRuleMaps = payload;
    },
    setRuleOverride: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserRuleOverride>
    ) => {
      console.log("setRuleOverride");
      const existingOverride = state.overrides.find((x) => x.id == payload.id);

      if (!existingOverride) {
        state.overrides.push(payload);
        return;
      }

      state.overrides = state.overrides.map((item) =>
        item.id == payload.id
          ? {
              ...item,
              ...payload,
            }
          : item
      );
    },
  },
});

export const { setDefaultRules, setRulesMaps, setRuleOverride } =
  parserSettingsSlice.actions;

export const getXmlElementRule =
  (node: XmlElement) =>
  (state: RootState): XmlParserRule => {
    const store = state.parserSettings;
    const map = store.elementRuleMaps.find((x) => x.xmlElementId == node.id)!;

    const defaultRule = store.defaultRules.find((x) => x.id == map.ruleId)!;
    const ruleOverride = store.overrides.find((x) => x.id == map.ruleId);

    if (!ruleOverride) {
      return defaultRule;
    }

    return {
      ...defaultRule,
      ...ruleOverride,
    };
  };

export const getApplicableRules = (state: RootState): XmlParserRule[] => {
  const store = state.parserSettings;

  return store.defaultRules.map((defaultRule) => {
    const override = store.overrides.find((o) => o.id == defaultRule.id);

    if (!override) {
      return defaultRule;
    }

    return {
      ...defaultRule,
      ...override,
    };
  });
};

export default parserSettingsSlice.reducer;
