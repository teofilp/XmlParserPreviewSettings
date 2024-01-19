import { Button, Form, Input, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { XmlParserRuleOverride } from "../models/rules";
import { TranslateRule } from "../models/translateRule";
import { useAppDispatch } from "../store";
import {
  deleteRuleOverride,
  setRuleOverride,
} from "../store/parserSettings/parserSettingsSlice";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { setXPathSelector } from "../store/activeNodesSlice";

const getDefaultValues = (): XmlParserRuleOverride => ({
  xpathSelector: "",
  id: uuidv4(),
  isInline: false,
});

const translateOptions = [
  {
    value: TranslateRule.Yes,
    label: "Yes",
  },
  {
    value: TranslateRule.No,
    label: "No",
  },
];

const elementTypeOptions = [
  {
    value: true,
    label: "Inline",
  },
  {
    value: false,
    label: "Structure",
  },
];

interface CreateXPathRuleFormProps {
  item?: XmlParserRuleOverride;
}

export const CreateXPathRuleForm = ({ item }: CreateXPathRuleFormProps) => {
  const [form] = Form.useForm();
  const xpathSelector = Form.useWatch("xpathSelector", form);
  const dispatch = useAppDispatch();
  const isCreate = !item;
  const [isEditing, setIsEditing] = useState<boolean>(isCreate);

  const handleFinish = (formData: XmlParserRuleOverride) => {
    const data = isCreate
      ? {
          ...getDefaultValues(),
          ...formData,
        }
      : {
          ...item,
          ...formData,
        };
    dispatch(setRuleOverride(data));
    dispatch(setXPathSelector(""));
    isCreate && form.resetFields();
    !isCreate && setIsEditing(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      () => dispatch(setXPathSelector(xpathSelector)),
      500
    );

    return () => clearTimeout(timeoutId);
  }, [xpathSelector]);

  const handleRemove = () => {
    dispatch(deleteRuleOverride(item!.id));
    dispatch(setXPathSelector(""));
  };

  return (
    <Form
      layout="inline"
      form={form}
      name={item?.id ?? getDefaultValues().id}
      onFinish={handleFinish}
      initialValues={item ?? getDefaultValues()}
      style={{ padding: "24px 0" }}
    >
      <Form.Item<string>
        label="XPath"
        name="xpathSelector"
        style={{ marginBottom: 36, width: "100%" }}
        rules={[
          { required: true, message: "XPath is required" },
          {
            validator: (_, value) => {
              try {
                document.createExpression(value);
                return Promise.resolve();
              } catch {
                return Promise.reject("Invalid XPath");
              }
            },
          },
        ]}
      >
        <Input disabled={!isEditing} />
      </Form.Item>
      <Form.Item<string>
        label="Tag type"
        name="isInline"
        style={{ marginBottom: 36, width: "49%" }}
      >
        <Select
          defaultValue={false}
          disabled={!isEditing}
          options={elementTypeOptions}
        />
      </Form.Item>
      <Form.Item<string>
        label="Translate"
        name="translate"
        style={{ marginBottom: 36, width: "45%" }}
      >
        <Select disabled={!isEditing} options={translateOptions} />
      </Form.Item>
      {!isEditing && (
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={() => setIsEditing(true)}
          >
            Edit rule
          </Button>
        </Form.Item>
      )}
      {isEditing && isCreate ? (
        <Form.Item>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            Add rule
          </Button>
        </Form.Item>
      ) : isEditing ? (
        <>
          <Form.Item>
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              Update rule
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              onClick={handleRemove}
              style={{ width: "100%" }}
              danger
              type="primary"
            >
              Remove rule
            </Button>
          </Form.Item>
        </>
      ) : null}
    </Form>
  );
};
