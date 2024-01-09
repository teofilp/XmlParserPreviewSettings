import { Flex } from "antd";
import { FileLoader } from "./components/FileLoader";
import { useEffect, useState, useContext } from "react";
import { RcFile } from "antd/es/upload";

import "./App.css";
import { getXmlAsObjectAsync } from "./utils/xmlParser";
import XmlElementComponent from "./components/XmlElement";
import { AppContext } from "./context/AppContext";
import { useAppDispatch } from "./store";
import { setTranslateRules, setWithinTextRules } from "./store/parserSettings/parserSettingsSlice";

function App() {
  const [file, setFile] = useState<RcFile | null>(null);
  const { initializeAppState, appState } = useContext(AppContext);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!file) return;

    getXmlAsObjectAsync(file).then(({ translateRules, withinTextRules, ...rest }) => {
      dispatch(setTranslateRules(translateRules));
      dispatch(setWithinTextRules(withinTextRules));
      initializeAppState(rest)
    }).catch(console.error);
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
          {appState.xmlRoot && <XmlElementComponent element={appState.xmlRoot} />}
        </div>
      </Flex>
    </Flex>
  );
}

export default App;
