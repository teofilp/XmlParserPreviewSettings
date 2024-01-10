import { Flex } from "antd";
import { FileLoader } from "./components/FileLoader";
import { useEffect, useState, useContext } from "react";
import { RcFile } from "antd/es/upload";

import "./App.css";
import { getXmlAsObjectAsync } from "./utils/xmlParser";
import { AppContext } from "./context/AppContext";
import { useAppDispatch } from "./store";
import {
  setRules,
} from "./store/parserSettings/parserSettingsSlice";
import { XmlRenderer } from "./components/XmlRenderer";
import xmlRuleApplier from "./utils/xmlRuleApplier";

function App() {
  const [file, setFile] = useState<RcFile | null>(null);
  const { initializeAppState, appState } = useContext(AppContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!file) return;

    getXmlAsObjectAsync(file)
      .then(({ parserRules, ...rest }) => {
        dispatch(setRules(parserRules));
        console.log(parserRules);
        xmlRuleApplier.applyRules(rest.xmlDocument, rest.xmlDomDocument, parserRules);
        initializeAppState(rest);
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
            <button onClick={() => setFile(null)}>Reset</button>
          </div>
        )}
      </Flex>
      <Flex flex={2}>
        <div>
          XML Preview
          <div>
            {appState.xmlDocument && (
              <XmlRenderer elements={appState.xmlDocument?.children} />
            )}
          </div>
        </div>
      </Flex>
    </Flex>
  );
}

export default App;
