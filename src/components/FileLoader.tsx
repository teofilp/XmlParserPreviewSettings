import { useContext } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Dragger from "antd/es/upload/Dragger";
import { processXmlFile } from "../utils/xmlParser";
import xmlRuleApplier from "../utils/xmlRuleApplier";
import { AppContext } from "../context/AppContext";
import { useXmlParserSettingsContext } from "../context/XmlParserSettingsContext";

export const FileLoader = () => {
  const { initializeAppState } = useContext(AppContext);
  const { setRulesMaps, setDefaultRules } = useXmlParserSettingsContext();

  const processFile = (file: RcFile) => {
    processXmlFile(file)
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
        console.log(elementRuleMaps);
        setRulesMaps(elementRuleMaps);
        setDefaultRules(parserRules);
      })
      .catch(console.error);

    return false;
  };

  return (
    <div style={{ flex: 1 }}>
      <Dragger accept=".xml" name="file" beforeUpload={processFile}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </div>
  );
};
