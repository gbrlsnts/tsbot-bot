import { Configuration } from "./Configuration";
import { LoaderInterface } from "./LoaderInterface";
import { readdir, readFile } from "fs";
import { join as pathJoin } from "path";
import { ConnectionProtocol } from "../ConnectionProtocol";

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
        return new Promise((resolve, reject) => {
            readdir(this.configFolder, (err, files) => {
                if(err)
                    return reject(new Error(`Error while scanning configurations folder <${this.configFolder}>`));
    
                let configFile = null;

                files.forEach(fileName => {
                    if(this.isValidConfigExtension(fileName) && this.isWantedConfig(fileName, name)) {
                        configFile = fileName;
                    }
                });

                if(configFile === null)
                    return reject(new Error('No configuration found for the server'));

                this.getConfigContents(configFile)
                    .then(configContents => this.mapConfigContentsToConfiguration(configContents))
                    .then(configuration => resolve(configuration))
                    .catch(error => reject(error));
            });
        });
    }

    /**
     * Verify if a filename has the valid extension for a server configuration
     * @param fileName File name to check
     */
    private isValidConfigExtension(fileName: string): boolean
    {
        return fileName.endsWith('.cfg');
    }

    /**
     * Verify if a configuration belongs to a given server Id
     * @param fileName File name to check
     * @param name The configuration name to compare
     */
    private isWantedConfig(fileName: string, name: string): boolean
    {
        const split = fileName.split('.');

        if(split.length !== 2)
            return false;

        return split[0] === name;
    }

    /**
     * Get the contents of a configuration file
     * @param fileName File to load contents from
     */
    private async getConfigContents(fileName: string): Promise<string>
    {
        return new Promise((resolve, reject) => {
            readFile(pathJoin(this.configFolder, fileName), 'utf8', (err, data) => {
                if(err)
                    return reject(new Error('Error reading configuration contents'));

                resolve(data);
            });
        });
    }

    /**
     * Map a configuration file contents to a Configuration object
     * @param contents The contents to map
     */
    private async mapConfigContentsToConfiguration(contents: string): Promise<Configuration>
    {
        let json = null;

        try {
            json = JSON.parse(contents);
        } catch(e) {
            return Promise.reject(new Error('Could not parse configuration contents: ' + e.message));
        }

        return Promise.resolve(json);
    }
}