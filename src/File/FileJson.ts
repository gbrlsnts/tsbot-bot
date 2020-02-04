import FileReaderWriter from "./FileReaderWriter";

export default class FileJson<T> extends FileReaderWriter
{
    constructor(filePath: string)
    {
        super(filePath);
        this.setBaseContents('{}');
    }

    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    async loadFileJson(): Promise<T>
    {
        await this.checkFile();
        
        const contents = await this.getFileContents();

        return this.mapContentsToType(contents);
    }

    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    async saveFileJson(object: T): Promise<void>
    {
        await this.checkFile();
        
        const contents = await this.mapTypeToContents(object);
        
        await this.writeFileContents(contents);
    }

    /**
     * Map a file contents to a @type <T> object
     * @param contents The contents to map
     */
    private async mapContentsToType(contents: string): Promise<T>
    {
        let json = null;

        try {
            json = JSON.parse(contents);
        } catch(e) {
            return Promise.reject(new Error('Could not parse file contents: ' + e.message));
        }

        return Promise.resolve(json);
    }

    /**
     * Map @type <T> object to contents
     * @param contents The object to map
     */
    private async mapTypeToContents(object: T): Promise<string>
    {
        let contents = null;

        try {
            contents = JSON.stringify(object, null, 4);
        } catch(e) {
            return Promise.reject(new Error('Could stringify object: ' + e.message));
        }

        return Promise.resolve(contents);
    }

    /**
     * Initialize an empty file
     * @param force Write empty file even if it already exists
     */
    public async initializeFile(force: boolean = false): Promise<void>
    {
        return super.initializeFile(force);
    }
}