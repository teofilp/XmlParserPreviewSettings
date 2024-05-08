import { FileLoader } from "./FileLoader";
import isNil from "lodash.isnil";
import { RulesOverridesList } from "./RulesOverridesList";
import { XPathRulesList } from "./XPathRulesList";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import styled from "styled-components";
import { useXmlParserSettingsContext } from "../context/XmlParserSettingsContext";
import { Flex } from "./Flex";

const FlexContainer = styled.div`
  display: flex;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
`;

const ContainerInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ExportButton = styled.button`
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
        <ContainerInner>
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
            <Flex $vertical align="center">
              Select rules configuration mode
              <Flex gap={12}>
                <button onClick={() => setModeType(true)}>Element rules</button>
                <button onClick={() => setModeType(false)}>XPath rules</button>
              </Flex>
            </Flex>
          ) : useElementRules ? (
            <RulesOverridesList />
          ) : (
            <XPathRulesList />
          )}
          <ExportButton>Export settings</ExportButton>
        </ContainerInner>
      )}
    </FlexContainer>
  );
};
