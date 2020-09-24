import { TarReader } from "./TarReader";

function extension(filename: string): string {
  return filename.substr(filename.lastIndexOf(".") + 1);
}

// TODO: Use a proper mime types library
function mimeType(filename: string): string | undefined {
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png"
  };
  return mimeTypes[extension(filename)];
}

export class ResourceArchive {
  tarReader: TarReader;
  constructor(file: File) {
    this.tarReader = new TarReader(file);
  }

  public async getFileInfo(): Promise<string[]> {
    return await this.tarReader.getFileInfo();
  }

  public async getBlob(path: string): Promise<Blob> {
    return await this.tarReader.getFileBlob(path);
  }

  public async getDataUrl(path: string): Promise<string> {
    const reader = new FileReader();
    const blob = await this.tarReader.getFileBlob(path, {
      type: mimeType(path)
    });
    return new Promise((resolve, reject) => {
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          resolve(result as string);
        } else {
          reject(`failed to readAsDataURL ${path}`);
        }
      };
      reader.readAsDataURL(blob);
    });
  }
}
