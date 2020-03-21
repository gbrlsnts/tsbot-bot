import { Configuration } from "./Configuration";
import { LoaderInterface } from "./LoaderInterface";
import { join as pathJoin } from "path";
import FileJson from "../../File/FileJson";

export class LocalLoader implements LoaderInterface
{
    constructor(private configFolder: string)
    {

    }

    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    async loadConfiguration(name: string): Promise<Configuration>
    {
        const file = new FileJson<Configuration>(pathJoin(this.configFolder, `${name}.cfg`));

        return file.loadFileJson();
    }
}