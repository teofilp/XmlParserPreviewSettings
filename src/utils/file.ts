import { RcFile } from "antd/es/upload";

export const getFileContentAsTextAsync = (file: RcFile): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (!e || !e.target) {
        reject();
      }

      resolve(e!.target!.result as string);
    };

    var buffer = await file.arrayBuffer();
    var blob = new Blob([buffer], { type: file.type });
    fileReader.readAsText(blob);
  });
};
