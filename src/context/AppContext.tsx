import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { XmlDocument } from "../models/xmlDocument";
import { XmlElement, XmlElementSettings } from "../models/xmlElement";
import xmlRuleApplier from "../utils/xmlRuleApplier";
import { useActiveNodesContext } from "./ActiveNodesContext";
import { useXmlParserSettingsContext } from "./XmlParserSettingsContext";

interface AppState {
  xmlDocument: XmlDocument | null;
  xmlDomDocument: Document | null;
  isInitialized: boolean;
  xmlElementSettings: XmlElementSettings[];
  useElementRules: boolean | null;
  loadedFile?: File;
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
    _: Omit<AppState, "isInitialized" | "useElementRules"> & {
      loadedFile: File;
    }
  ) => {},
  getElementSettings: (_: XmlElement): XmlElementSettings | undefined => {
    return;
  },
  resetAppState: () => {},
  setModeType: (_: boolean) => {},
});

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
  const [appState, setAppState] = useState<AppState>(getDefaultAppState());
  const { applicableRules } = useXmlParserSettingsContext();

  const {
    state: { xpathSelector },
    setNodeIds
  } = useActiveNodesContext();

  const initializeAppState = (
    payload: Omit<AppState, "isInitialized" | "useElementRules"> & {
      loadedFile: File;
    }
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
      applicableRules
    );

    setAppState((old) => ({
      ...old,
      xmlElementSettings: elementSettings,
    }));
  }, [applicableRules]);

  useEffect(() => {
    if (!appState.xmlDomDocument || !xpathSelector) return;

    const nodesIds = xmlRuleApplier
      .evaluateXPath(appState.xmlDomDocument, xpathSelector)
      .filter((x) => !!x)
      .map((x) => x.id);

    setNodeIds(nodesIds);
  }, [xpathSelector, appState.xmlDomDocument]);

  const value = {
    appState,
    initializeAppState,
    getElementSettings,
    resetAppState,
    setModeType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
