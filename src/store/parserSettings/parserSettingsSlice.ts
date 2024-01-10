import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  XmlParserRule,
} from "../../models/rules";

export interface XmlParserSettingsState {
  rules: XmlParserRule[];
}

const getDefaultState = (): XmlParserSettingsState => ({
  rules: [],
});

export const parserSettingsSlice = createSlice({
  name: "parserSettings",
  initialState: getDefaultState(),
  reducers: {
    setRules: (
      state: XmlParserSettingsState,
      { payload }: PayloadAction<XmlParserRule[]>
    ) => {
      state.rules = payload;
    },
  },
});

export const { setRules } = parserSettingsSlice.actions;

export default parserSettingsSlice.reducer;
