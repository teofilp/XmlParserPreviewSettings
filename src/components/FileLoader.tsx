import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";

export const FileLoader = ({ setFile }: any) => (
  <div style={{ flex: 1 }}>
    <Dragger
      accept=".xml"
      name="file"
      beforeUpload={(newFile) => {
        setFile(newFile);
        return false;
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Dragger>
  </div>
);
