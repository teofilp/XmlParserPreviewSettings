import { Button, Flex } from "antd";
import { FileLoader } from "./FileLoader";
import isNil from "lodash.isnil";
import { RulesOverridesList } from "./RulesOverridesList";
import { XPathRulesList } from "./XPathRulesList";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { DownloadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useXmlParserSettingsContext } from "../context/XmlParserSettingsContext";

const FlexContainer = styled(Flex)`
  padding: 8px;
  overflow-y: auto;
  flex: 1;
`;

const ContainerInner = styled(Flex)`
    width: 100%;
`;

const ExportButton = styled(Button)`
    margin-top: 32px;
`;

export const XmlPreviewSidePanel = () => {
  const {
    appState: { useElementRules, loadedFile },
    setModeType,
    resetAppState,
  } = useContext(AppContext);
  const { resetState } = useXmlParserSettingsContext();

  return (
    <FlexContainer>
      {!loadedFile && <FileLoader />}
      {loadedFile && (
        <ContainerInner vertical>
          <div>
            {loadedFile!.name}
            <button
              onClick={() => {
                resetAppState();
                resetState();
              }}
            >
              Reset
            </button>
          </div>
          {isNil(useElementRules) ? (
            <Flex vertical align="center">
              Select rules configuration mode
              <Flex gap={12}>
                <Button type="primary" onClick={() => setModeType(true)}>
                  Element rules
                </Button>
                <Button type="primary" onClick={() => setModeType(false)}>
                  XPath rules
                </Button>
              </Flex>
            </Flex>
          ) : useElementRules ? (
            <RulesOverridesList />
          ) : (
            <XPathRulesList />
          )}
          <ExportButton
            icon={<DownloadOutlined />}
            type="primary"
          >
            Export settings
          </ExportButton>
        </ContainerInner>
      )}
    </FlexContainer>
  );
};
