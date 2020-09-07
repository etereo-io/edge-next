abstract class AbstractStorage {
  abstract async uploadFile(filePath: string, name: string, type: string, folder: string): Promise<string>;
  abstract async deleteFile(file: string): Promise<boolean>;
}

export default AbstractStorage;