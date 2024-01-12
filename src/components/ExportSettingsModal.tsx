import { Form, Input, Modal } from "antd";

interface ExportSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
}

const getDefaultValues = () => ({
  fileTypeName: "(Replace with the name of this file type)",
  fileTypeId: "XML v 2.0.0.0",
  extensions: "*.xml",
  description: "(Replace with a description of this file type)",
});

export const ExportSettingsModal = ({
  isOpen,
  setIsOpen,
}: ExportSettingsModalProps) => {
  const { 0: form } = Form.useForm();

  const handleFinish = (data: any) => { console.log(data); };

  return (
    <Modal
      title="Export XML Settings"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={() => setIsOpen(false)}
      okText="Export"
      afterClose={() => form.resetFields()}
    >
      <Form
        layout="vertical"
        form={form}
        name="xmlExportSettingsMetadata"
        onFinish={handleFinish}
        initialValues={getDefaultValues()}
        style={{ padding: "24px 0" }}
      >
        <Form.Item<string>
          label="File Type Name"
          name="fileTypeName"
          style={{ marginBottom: 36 }}
          rules={[{ required: true, message: "File Type Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<string>
          label="File Type Id"
          name="fileTypeId"
          style={{ marginBottom: 36 }}
          rules={[{ required: true, message: "File Type Id is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<string>
          label="Extensions"
          name="extensions"
          style={{ marginBottom: 36 }}
          rules={[{ required: true, message: "Extensions is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<string>
          label="Description"
          name="description"
          style={{ marginBottom: 36 }}
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
