import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  XmlParserTranslateRule,
  XmlParserWithinTextRule,
} from "../../models/rules";

export interface XmlParserSettingsState {
  translateRules: XmlParserTranslateRule[];
  withinTextRules: XmlParserWithinTextRule[];
}

const getDefaultState = (): XmlParserSettingsState => ({
  translateRules: [],
  withinTextRules: [],
});

export const parserSettingsSlice = createSlice({
  name: "parserSettings",
  initialState: getDefaultState(),
  reducers: {
    setTranslateRules: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserTranslateRule[]>
    ) => {
      state.translateRules = payload;
    },
    setWithinTextRules: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserWithinTextRule[]>
    ) => {
      state.withinTextRules = payload;
    },
    addTranslateRule: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserTranslateRule>
    ) => {
      state.translateRules.push(payload);
    },
    addWithinTextRule: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserWithinTextRule>
    ) => {
      state.withinTextRules.push(payload);
    },
  },
});

export const {
  addTranslateRule,
  addWithinTextRule,
  setTranslateRules,
  setWithinTextRules,
} = parserSettingsSlice.actions;

export default parserSettingsSlice.reducer;
