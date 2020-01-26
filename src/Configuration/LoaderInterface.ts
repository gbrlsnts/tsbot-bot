import { Configuration } from "./Configuration";

export interface LoaderInterface {
    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    loadConfiguration(name: string): Promise<Configuration>;
}