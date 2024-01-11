import { Flex } from "antd";
import { FileLoader } from "./components/FileLoader";
import { useEffect, useState, useContext } from "react";
import { RcFile } from "antd/es/upload";

import "./App.css";
import { getXmlAsObjectAsync } from "./utils/xmlParser";
import { AppContext } from "./context/AppContext";
import { useAppDispatch } from "./store";
import {
  setDefaultRules,
  setRulesMaps,
} from "./store/parserSettings/parserSettingsSlice";
import { XmlRenderer } from "./components/XmlRenderer";
import xmlRuleApplier from "./utils/xmlRuleApplier";

function App() {
  const [file, setFile] = useState<RcFile | null>(null);
  const { initializeAppState, appState, resetAppState } = useContext(AppContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!file) return;

    getXmlAsObjectAsync(file)
      .then(({ parserRules, ...rest }) => {
        var { elementRuleMaps, elementSettings } = xmlRuleApplier.applyRules(
          rest.xmlDocument,
          rest.xmlDomDocument,
          parserRules
        );
        initializeAppState({
          ...rest,
          xmlElementSettings: elementSettings,
        });
        dispatch(setRulesMaps(elementRuleMaps));
        dispatch(setDefaultRules(parserRules));
      })
      .catch(console.error);
  }, [file]);

  return (
    <Flex style={{ height: "100%" }}>
      <Flex flex={1}>
        {!file && <FileLoader setFile={setFile} />}
        {file && (
          <div>
            {file.name}
            <button onClick={() => {
              setFile(null);
              resetAppState();
            }}>Reset</button>
          </div>
        )}
      </Flex>
      <Flex flex={1}>
        <div className="preview-panel">
          XML Preview
          <div>
            {appState.xmlDocument && (
              <XmlRenderer elements={appState.xmlDocument?.getRootNodes()} />
            )}
          </div>
        </div>
      </Flex>
    </Flex>
  );
}

export default App;
