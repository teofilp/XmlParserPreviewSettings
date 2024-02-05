import { PropsWithChildren, useMemo, useContext } from "react";
import { XmlElement } from "../../models/xmlElement";
import { XmlElementType } from "../../models/xmlElementType";
import { Indentation } from "../Indentation";
import { XmlNodeProps } from "./commonProps";
import { XmlRenderer } from "../XmlRenderer";
import { TranslateRule } from "../../models/translateRule";
import { XmlNodeActionPopoverContent } from "../popover/XmlNodeActionPopoverContent";
import { ActionPopover } from "../popover/ActionPopover";
import { AppContext } from "../../context/AppContext";
import { useNodeIsSelected } from "../../hooks/useNodeIsSelected";

const buildStartTag = (
  element: XmlElement,
  isInline: boolean,
  isSelected: boolean
) => {
  const hasAttributes = element.attributes.length > 0;
  const popoverContent = () => (
    <XmlNodeActionPopoverContent element={element} />
  );

  if (!hasAttributes) {
    return () => (
      <ActionPopover trigger="click" content={popoverContent}>
        <span
          className={
            isSelected
              ? "nodeTag selected"
              : isInline
              ? "nodeTag inlineTag"
              : "nodeTag"
          }
        >{`<${element.name}>`}</span>
      </ActionPopover>
    );
  }

  const attributes = element.attributes
    .map((x) => `${x.key}="${x.value}"`)
    .join(" ");

  return () => (
    <ActionPopover trigger="click" content={popoverContent}>
      <span
        className={
          isSelected
            ? "nodeTag selected"
            : isInline
            ? "nodeTag inlineTag"
            : "nodeTag"
        }
      >{`<${element.name}  ${attributes}>`}</span>
    </ActionPopover>
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

  const StartTag = buildStartTag(element, isInline, isSelected);
  const EndTag = buildEndTag(element, isInline, isSelected);

  const children = useMemo(
    () => xmlDocument?.getChildrenOfNode(element) ?? [],
    [xmlDocument, element]
  );

  return (
    <>
      <Indentation isInline={isInline} depth={depth}>
        <StartTag />
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
