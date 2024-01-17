
export const downloadXml = (xml: string) => {
    const blob = new Blob([xml], { type: "application/xml" });

    const downloadLink = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = "xmlSettings.sdlftsettings";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(url);
} 