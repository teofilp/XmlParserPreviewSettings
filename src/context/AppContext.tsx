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
}

const getDefaultAppState = (): AppState => ({
  xmlDocument: null,
  xmlDomDocument: null,
  isInitialized: false,
  xmlElementSettings: [],
});

export const AppContext = createContext({
  appState: getDefaultAppState(),
  initializeAppState: (_: Omit<AppState, "isInitialized">) => {},
  getElementSettings: (_: XmlElement): XmlElementSettings | undefined => {
    return;
  },
  resetAppState: () => {}
});

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState());
  const rules = useSelector(getApplicableRules);

  const initializeAppState = (payload: Omit<AppState, "isInitialized">) => {
    setAppState({
      isInitialized: true,
      ...payload,
    });
  };

  const resetAppState = () => {
    setAppState(getDefaultAppState());
  }

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

    setAppState(old => ({
        ...old,
        xmlElementSettings: elementSettings
    }));
  }, [rules]);

  const value = {
    appState,
    initializeAppState,
    getElementSettings,
    resetAppState
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
