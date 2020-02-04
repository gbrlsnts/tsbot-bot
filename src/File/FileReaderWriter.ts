import { access, readFile, writeFile, write } from "fs";

export default class FileReaderWriter
{
    /** Conents to initialize a base file */
    private baseContents: string = '';

    constructor(readonly filePath: string)
    {

    }

    /**
     * Set the contents used to initialize a file
     * @param contents Contents used to initialize a file
     */
    public setBaseContents(contents: string)
    {
        this.baseContents = contents;
    }

    /**
     * Get the contents used to initialize a file
     */
    public getBaseContents(): string
    {
        return this.baseContents;
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

    /**
     * Initialize a base file
     * @param force Write empty file even if it already exists
     */
    public async initializeFile(force: boolean = false): Promise<void>
    {
        try {
            await this.checkFile();

            if(!force) {
                return Promise.resolve();                
            }
        } catch(e) {
            // file doesnt exist.. 
        }
        
        return this.writeFileContents(this.baseContents);
    }
}