import { XmlParserRule } from "../models/rules";

export class XmlBuilder {
    private document: Document;

    constructor() {
        this.document = document.implementation.createDocument("", "", null);
    }

    buildXml(profileData: any, rules: XmlParserRule[]): string {
        


        return "";
    }

    private buildProfileData(profileData: any): HTMLElement {
        const profileDataSetting = this.document.createElement("Setting");
        profileDataSetting.setAttribute("Id", "FileTypeConfiguration_ProfileData");

        const fileTypeInformation = this.document.createElementNS("http://www.sdl.com/filetypesupport", "FileTypeInformation");
        fileTypeInformation.setAttribute("xmlns:i", "http://www.w3.org/2001/XMLSchema-instance");

        const description = this.document.createElement("Description");
        description.innerText = profileData.description;

        const fileDialogWildcardExpresion = this.document.createElement("FileDialogWildcardExpression");
        fileDialogWildcardExpresion.innerText = profileData.extensions;

        const fileTypeDefinitionId = this.document.createElement("FileTypeDefinitionId");
        fileTypeDefinitionId.innerText = profileData.fileTypeDefinitionId;

        const fileTypeName = this.document.createElement("FileTypeName");
        fileTypeName.innerText = profileData.fileTypeName;

        fileTypeInformation.appendChild(description);
        fileTypeInformation.appendChild(fileDialogWildcardExpresion);
        fileTypeInformation.appendChild(fileTypeDefinitionId);
        fileTypeInformation.appendChild(fileTypeName);

        profileDataSetting.appendChild(fileTypeInformation);

        return profileDataSetting;
    }
}