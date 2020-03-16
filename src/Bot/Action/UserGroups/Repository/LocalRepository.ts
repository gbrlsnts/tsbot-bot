import { join as pathJoin } from 'path';
import { RepositoryInterface } from "./RepositoryInterface";
import FileJson from '../../../../File/FileJson';

export class LocalRepository implements RepositoryInterface
{
    private readonly groupsFilePath: string;

    constructor(readonly databasePath: string)
    {
        this.groupsFilePath = pathJoin(this.databasePath, 'usergroups.json');
    }

    /**
     * Get the allowed user groups
     */
    async getUserGroups(): Promise<number[]>
    {
        const loader = await this.getFileLoader<number[]>(this.groupsFilePath);

        return loader.loadFileJson();
    }

    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    private async getFileLoader<T>(filePath: string): Promise<FileJson<T>>
    {
        const loader = new FileJson<T>(filePath);
        loader.setBaseContents('[]');

        await loader.initializeFile();

        return loader;
    }
}