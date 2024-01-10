import { PropsWithChildren, createContext, useState } from "react";
import { XmlDocument } from "../models/xmlDocument";

interface AppState {
  xmlDocument: XmlDocument | null;
  xmlDomDocument: Document | null;
  isInitialized: boolean;
}

const getDefaultAppState = (): AppState => ({
  xmlDocument: null,
  xmlDomDocument: null,
  isInitialized: false,
});

export const AppContext = createContext({
  appState: getDefaultAppState(),
  initializeAppState: (_: Omit<AppState, "isInitialized">) => {},
});

export const AppContextProvider = ({ children }: PropsWithChildren<any>) => {
    const [appState, setAppState] = useState<AppState>(getDefaultAppState());

    const initializeAppState = (payload: Omit<AppState, 'isInitialized'>) => {
        setAppState({
            isInitialized: true,
            ...payload
        });
    }

    const value = {
        appState,
        initializeAppState
    };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
