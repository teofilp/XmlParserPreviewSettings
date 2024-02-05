import { RcFile } from "antd/es/upload";

export const getFileWithContentAsTextAsync = (
  file: RcFile
): Promise<{ content: string; file: File }> => {
  return new Promise(async (resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!e || !e.target) {
        reject();
      }

      resolve({
        content: e!.target!.result as string,
        file: new File([blob], file.name),
      });
    };

    var buffer = await file.arrayBuffer();
    var blob = new Blob([buffer], { type: file.type });
    fileReader.readAsText(blob);
  });
};
