import { PropsWithChildren, useMemo, useContext } from "react";
import { XmlElement } from "../../models/xmlElement";
import { XmlElementType } from "../../models/xmlElementType";
import { Indentation } from "../Indentation";
import { XmlNodeProps } from "./commonProps";
import { XmlRenderer } from "../XmlRenderer";
import { TranslateRule } from "../../models/translateRule";
import { XmlNodeActionPopoverContent } from "../popover/XmlNodeActionPopoverContent";
import { AppContext } from "../../context/AppContext";
import { useNodeIsSelected } from "../../hooks/useNodeIsSelected";
import { Popover } from "../popover/Popover";

const StartTag = ({
  element,
  isInline,
  isSelected,
}: {
  element: XmlElement;
  isInline: boolean;
  isSelected: boolean;
}) => {
  const hasAttributes = element.attributes.length > 0;
  const PopoverContent = () => (
    <XmlNodeActionPopoverContent element={element} />
  );

  if (!hasAttributes) {
    return (
      <Popover content={<PopoverContent />}>
        <span
          className={
            isSelected
              ? "nodeTag selected"
              : isInline
              ? "nodeTag inlineTag"
              : "nodeTag"
          }
        >
          {`<${element.name}>`}
        </span>
      </Popover>
    );
  }

  const attributes = element.attributes
    .map((x) => `${x.key}="${x.value}"`)
    .join(" ");

  return (
    <Popover content={<PopoverContent />}>
      <span
        className={
          isSelected
            ? "nodeTag selected"
            : isInline
            ? "nodeTag inlineTag"
            : "nodeTag"
        }
      >
        {`<${element.name}  ${attributes}>`}
      </span>
    </Popover>
  );
};

const buildEndTag = (
  element: XmlElement,
  isInline: boolean,
  isSelected: boolean
) => {
  return () => (
    <span
      className={
        isSelected
          ? "nodeTag selected"
          : isInline
          ? "nodeTag inlineTag"
          : "nodeTag"
      }
    >{`</${element.name}>`}</span>
  );
};

const ElementNode = ({ element }: PropsWithChildren<XmlNodeProps>) => {
  const {
    appState: { xmlDocument },
    getElementSettings,
  } = useContext(AppContext);
  const isSelected = useNodeIsSelected(element.id);

  const settings = getElementSettings(element);

  const isInline = settings?.type == XmlElementType.Inline;
  const depth = element.depth;

  if (element.isText) {
    return <Indentation depth={depth}>{element.textValue!}</Indentation>;
  }

  const EndTag = buildEndTag(element, isInline, isSelected);

  const children = useMemo(
    () => xmlDocument?.getChildrenOfNode(element) ?? [],
    [xmlDocument, element]
  );

  return (
    <>
      <Indentation isInline={isInline} depth={depth}>
        <StartTag {...{ element, isInline, isSelected }} />
        {children.length > 0 && (
          <XmlRenderer
            translatable={settings?.translateCurrentValue == TranslateRule.Yes}
            elements={children}
          />
        )}
        <EndTag />
      </Indentation>
    </>
  );
};

export default ElementNode;
