import { XmlNodeProps } from "./commonProps";

export const TextNode = ({ element, translatable }: XmlNodeProps) => {
  return (
    <span className={translatable ? "translatable" : "nontranslatable"}>
      <span className="textNode">{element.textValue!}</span>
    </span>
  );
};
