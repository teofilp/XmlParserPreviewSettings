import isNil from "lodash.isnil";
import { XmlParserRuleOverride } from "../models/rules";
import { TranslateRule } from "../models/translateRule";

export class XmlBuilder {
  private document: Document;

  constructor() {
    this.document = document.implementation.createDocument("", "", null);
  }

  buildXml(
    profileData: any,
    rules: XmlParserRuleOverride[],
    rootElement: string = "",
    useElementRules = true
  ): string {
    this.document = document.implementation.createDocument("", "", null);

    this.document.appendChild(
      this.document.createProcessingInstruction(
        "xml",
        'version="1.0" encoding="utf-8"'
      )
    );

    const group = this.createSettingsGroup(profileData.fileTypeId);

    const bundle = this.createSettingsBundle();
    bundle.appendChild(group);

    this.document.appendChild(bundle);

    /// add default settings
    group.appendChild(this.createSetting("SnifferRootElements", "True"));
    group.appendChild(this.createSetting("SnifferRootElements0", rootElement));
    group.appendChild(this.createSetting("Xml_WithinText_Rule_", "True"));
    group.appendChild(this.createSetting("Xml_Translate_Rule_", "True"));

    if (useElementRules)
      group.appendChild(
        this.createSetting("Xml_NS_NamespaceUse", "IgnoreNamespaces")
      );

    rules.forEach((rule, index) => {
      const settings = this.createRuleSettings(rule, index);
      settings.forEach((setting) => group.appendChild(setting));
    });

    group.appendChild(
      this.createSetting(
        "FileTypeConfiguration_ComponentBuilderId",
        "XML v 2.0.0.0"
      )
    );
    group.appendChild(this.buildProfileData(profileData));
    console.log(this.document);
    return new XMLSerializer().serializeToString(this.document);
  }

  private createRuleSettings(
    rule: XmlParserRuleOverride,
    index: number
  ): HTMLElement[] {
    const settings = [];

    settings.push(this.createSetting(`Xml_Translate_Rule_${index}`, "True"));
    settings.push(
      this.createSetting(`Xml_Translate_Rule_${index}Context`, "True")
    );
    settings.push(
      this.createSetting(
        `Xml_Translate_Rule_${index}CtxMustUseDisplayName`,
        "True"
      )
    );
    settings.push(
      this.createSetting(
        `Xml_Translate_Rule_${index}XPathSelector`,
        rule.xpathSelector
      )
    );

    if (!isNil(rule.translate)) {
      const value = rule.translate == TranslateRule.Yes ? "yes" : "no";
      settings.push(
        this.createSetting(`Xml_Translate_Rule_${index}Translate`, value)
      );
    }

    settings.push(this.createSetting(`Xml_WithinText_Rule_${index}`, "True"));
    settings.push(
      this.createSetting(`Xml_WithinText_Rule_${index}Context`, "True")
    );
    settings.push(
      this.createSetting(
        `Xml_WithinText_Rule_${index}CtxMustUseDisplayName`,
        "True"
      )
    );
    settings.push(
      this.createSetting(
        `Xml_WithinText_Rule_${index}XPathSelector`,
        rule.xpathSelector
      )
    );

    if (rule.isInline) {
      settings.push(
        this.createSetting(`Xml_WithinText_Rule_${index}WithinText`, "yes")
      );
    }

    return settings;
  }

  private buildProfileData(profileData: any): HTMLElement {
    const profileDataSetting = this.document.createElement("Setting");
    profileDataSetting.setAttribute("Id", "FileTypeConfiguration_ProfileData");

    const fileTypeInformation = this.document.createElement(
      "FileTypeInformation"
    );
    fileTypeInformation.setAttribute(
      "xmlns",
      "http://www.sdl.com/filetypesupport"
    );
    fileTypeInformation.setAttribute(
      "xmlns:i",
      "http://www.w3.org/2001/XMLSchema-instance"
    );

    const description = this.document.createElement("Description");
    description.innerHTML = profileData.description;

    const fileDialogWildcardExpresion = this.document.createElement(
      "FileDialogWildcardExpression"
    );
    fileDialogWildcardExpresion.innerHTML = profileData.extensions;

    const fileTypeDefinitionId = this.document.createElement(
      "FileTypeDefinitionId"
    );
    fileTypeDefinitionId.innerHTML = profileData.fileTypeId;

    const fileTypeName = this.document.createElement("FileTypeName");
    fileTypeName.innerHTML = profileData.fileTypeName;

    const fileTypeDocumentName = this.document.createElement(
      "FileTypeDocumentName"
    );
    fileTypeDocumentName.innerHTML = "XML Template Document";

    const fileTypeDocumentsName = this.document.createElement(
      "FileTypeDocumentsName"
    );
    fileTypeDocumentsName.innerHTML = "XML Template Documents";

    fileTypeInformation.appendChild(description);
    fileTypeInformation.appendChild(fileDialogWildcardExpresion);
    fileTypeInformation.appendChild(fileTypeDefinitionId);
    fileTypeInformation.appendChild(fileTypeName);
    fileTypeInformation.appendChild(fileTypeDocumentName);
    fileTypeInformation.appendChild(fileTypeDocumentsName);

    profileDataSetting.appendChild(fileTypeInformation);

    return profileDataSetting;
  }

  private createSetting(id: string, value: string) {
    const setting = this.document.createElement("Setting");
    setting.setAttribute("Id", id);
    setting.innerHTML = value;

    return setting;
  }

  private createSettingsBundle() {
    return this.document.createElement("SettingsBundle");
  }

  private createSettingsGroup(id: string) {
    const group = this.document.createElement("SettingsGroup");

    group.setAttribute("Id", id);

    return group;
  }
}

export default new XmlBuilder();
