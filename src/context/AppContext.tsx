import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { XmlDocument } from "../models/xmlDocument";
import { XmlElement, XmlElementSettings } from "../models/xmlElement";
import { useSelector } from "react-redux";
import { getApplicableRules } from "../store/parserSettings/parserSettingsSlice";
import xmlRuleApplier from "../utils/xmlRuleApplier";

interface AppState {
  xmlDocument: XmlDocument | null;
  xmlDomDocument: Document | null;
  isInitialized: boolean;
  xmlElementSettings: XmlElementSettings[];
  useElementRules: boolean | null;
}

const getDefaultAppState = (): AppState => ({
  xmlDocument: null,
  xmlDomDocument: null,
  isInitialized: false,
  xmlElementSettings: [],
  useElementRules: null,
});

export const AppContext = createContext({
  appState: getDefaultAppState(),
  initializeAppState: (
    _: Omit<AppState, "isInitialized" | "useElementRules">
  ) => {},
  getElementSettings: (_: XmlElement): XmlElementSettings | undefined => {
    return;
  },
  resetAppState: () => {},
  setModeType: (useElementRules: boolean) => {},
});

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState());
  const rules = useSelector(getApplicableRules);

  const initializeAppState = (
    payload: Omit<AppState, "isInitialized" | "useElementRules">
  ) => {
    setAppState({
      ...getDefaultAppState(),
      isInitialized: true,
      ...payload,
    });
  };

  const resetAppState = () => {
    setAppState(getDefaultAppState());
  };

  const setModeType = (useElementRules: boolean) => {
    setAppState((old) => ({
      ...old,
      useElementRules,
    }));
  };

  const getElementSettings = useCallback(
    (element: XmlElement): XmlElementSettings => {
      return appState.xmlElementSettings.find(
        (x) => x.elementId == element.id
      )!;
    },
    [appState]
  );

  useEffect(() => {
    if (!appState.isInitialized) return;
    var { elementSettings } = xmlRuleApplier.applyRules(
      appState.xmlDocument!,
      appState.xmlDomDocument!,
      rules
    );

    setAppState((old) => ({
      ...old,
      xmlElementSettings: elementSettings,
    }));
  }, [rules]);

  const value = {
    appState,
    initializeAppState,
    getElementSettings,
    resetAppState,
    setModeType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
