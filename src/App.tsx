import { Button, Flex } from "antd";
import { FileLoader } from "./components/FileLoader";
import { useEffect, useState, useContext } from "react";
import { RcFile } from "antd/es/upload";

import "./App.css";
import { getXmlAsObjectAsync } from "./utils/xmlParser";
import { AppContext } from "./context/AppContext";
import { useAppDispatch } from "./store";
import {
  resetState,
  setDefaultRules,
  setRulesMaps,
} from "./store/parserSettings/parserSettingsSlice";
import { XmlRenderer } from "./components/XmlRenderer";
import xmlRuleApplier from "./utils/xmlRuleApplier";
import { RulesOverridesList } from "./components/RulesOverridesList";
import { DownloadOutlined } from "@ant-design/icons";
import { ExportSettingsModal } from "./components/ExportSettingsModal";

function App() {
  const [file, setFile] = useState<RcFile | null>(null);
  const { initializeAppState, appState, resetAppState } =
    useContext(AppContext);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

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
    <Flex style={{ height: "100%", padding: "0 12px", overflow: "hidden" }}>
      <Flex flex={2} style={{ padding: "0 24px" }}>
        <div className="preview-panel">
          XML Preview
          <div>
            {appState.xmlDocument && (
              <XmlRenderer elements={appState.xmlDocument?.getRootNodes()} />
            )}
          </div>
        </div>
      </Flex>
      <Flex flex={1} style={{ padding: 8, overflowY: "auto" }}>
        {!file && <FileLoader setFile={setFile} />}
        {file && (
          <Flex vertical style={{ width: "100%" }}>
            <div>
              {file.name}
              <button
                onClick={() => {
                  setFile(null);
                  resetAppState();
                  dispatch(resetState());
                }}
              >
                Reset
              </button>
            </div>
            <RulesOverridesList />
            <Button onClick={() => setIsOpen(true)} icon={<DownloadOutlined/>} type="primary">Export settings</Button>
          </Flex>
        )}
      </Flex>
      <ExportSettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </Flex>
  );
}

export default App;
