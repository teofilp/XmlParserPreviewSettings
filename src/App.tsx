import { Flex as AntFlex } from "antd";
import { useState } from "react";

import { ExportSettingsModal } from "./components/ExportSettingsModal";
import { XmlRendererPreview } from "./components/XmlRendererPreview";
import { XmlPreviewSidePanel } from "./components/XmlPreviewSidePanel";
import { styled } from "styled-components";
import { ProvidersTree } from "./context/ProvidersTree.tsx";

const Flex = styled(AntFlex)`
  height: 100%;
  padding: 0 12px;
  overflow: hidden;
`;

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ProvidersTree>
      <Flex>
        <XmlRendererPreview />
        <XmlPreviewSidePanel />
        <ExportSettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    </ProvidersTree>
  );
}

export default App;
