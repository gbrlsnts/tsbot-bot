import { access, readFile, writeFile } from "fs";

export default class FileReaderWriter
{
    constructor(readonly filePath: string)
    {

    }

    /**
     * Try to validate the file by accessing it
     */
    public async checkFile(): Promise<void>
    {
        return new Promise((resolve, reject) => {
            access(this.filePath, (err) => {
                if(err) {
                    return reject(new Error(err.message));
                }

                resolve();
            });
        });
    }

    /**
     * Get the contents of a json file
     * @param fileName File to load contents from
     */
    public async getFileContents(): Promise<string>
    {
        return new Promise((resolve, reject) => {
            readFile(this.filePath, 'utf8', (err, data) => {
                if(err)
                    return reject(new Error('Error reading file contents'));

                resolve(data);
            });
        });
    }

    /**
     * Write the contents to a file
     * @param fileName File to load contents from
     */
    public async writeFileContents(contents: string): Promise<void>
    {
        return new Promise((resolve, reject) => {
            writeFile(this.filePath, contents, (err) => {
                if(err)
                    return reject(new Error('Error writing file contents'));

                resolve();
            });
        });
    }
}