import { Flex } from "antd";
import { FileLoader } from "./components/FileLoader";
import { useEffect, useState } from "react";
import { RcFile } from "antd/es/upload";

import "./App.css";
import { getXmlAsObjectAsync } from "./utils/xmlParser";
import { XmlElement } from "./models/xmlElement";
import XmlElementComponent from "./components/XmlElement";

function App() {
  const [file, setFile] = useState<RcFile | null>(null);
  const fileLoaded = !!file;
  const [root, setRoot] = useState<XmlElement | null>(null);

  useEffect(() => {
    if (!fileLoaded) return;

    getXmlAsObjectAsync(file).then(setRoot).catch(console.error);
  }, [file, fileLoaded]);

  return (
    <Flex style={{ height: "100%" }}>
      <Flex flex={1}>
        {!fileLoaded && <FileLoader setFile={setFile} />}
        {fileLoaded && (
          <div>
            {file.name}
            <button onClick={() => setFile(null)}>Reset</button>
          </div>
        )}
      </Flex>
      <Flex flex={2}>
        <div>
          XML Preview
          {root && <XmlElementComponent element={root} />}
        </div>
      </Flex>
    </Flex>
  );
}

export default App;
