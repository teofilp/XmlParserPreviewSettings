import { Flex } from "antd";
import { XmlRenderer } from "./XmlRenderer";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import styled from "styled-components";

const Container = styled(Flex)`
  flex: 2;
  padding: 0 24px;
`;

const PreviewPanel = styled.div`
  font-size: 16px;
  letter-spacing: 1px;
  line-height: 30px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  
  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }
  
  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const XmlRendererPreview = () => {
  const {
    appState: { xmlDocument },
  } = useContext(AppContext);

  return (
    <Container>
      <PreviewPanel>
        XML Preview
        <div>
          {xmlDocument && (
            <XmlRenderer elements={xmlDocument!.getRootNodes()} />
          )}
        </div>
      </PreviewPanel>
    </Container>
  );
};
