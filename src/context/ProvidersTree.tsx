import { PropsWithChildren } from "react";
import { XmlParserSettingsContextProvider } from "./XmlParserSettingsContext";
import { ActiveNodesContextProvider } from "./ActiveNodesContext";
import { AppContextProvider } from "./AppContext";

export const ProvidersTree = ({ children }: PropsWithChildren<any>) => (
  <XmlParserSettingsContextProvider>
    <ActiveNodesContextProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </ActiveNodesContextProvider>
  </XmlParserSettingsContextProvider>
);
