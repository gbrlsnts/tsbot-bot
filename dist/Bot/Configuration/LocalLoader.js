"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
class LocalLoader {
    constructor(configFolder) {
        this.configFolder = configFolder;
    }
    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    loadConfiguration(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.readdir(this.configFolder, (err, files) => {
                    if (err)
                        return reject(new Error(`Error while scanning configurations folder <${this.configFolder}>`));
                    let configFile = null;
                    files.forEach(fileName => {
                        if (this.isValidConfigExtension(fileName) && this.isWantedConfig(fileName, name)) {
                            configFile = fileName;
                        }
                    });
                    if (configFile === null)
                        return reject(new Error('No configuration found for the server'));
                    this.getConfigContents(configFile)
                        .then(configContents => this.mapConfigContentsToConfiguration(configContents))
                        .then(configuration => resolve(configuration))
                        .catch(error => reject(error));
                });
            });
        });
    }
    /**
     * Verify if a filename has the valid extension for a server configuration
     * @param fileName File name to check
     */
    isValidConfigExtension(fileName) {
        return fileName.endsWith('.cfg');
    }
    /**
     * Verify if a configuration belongs to a given server Id
     * @param fileName File name to check
     * @param name The configuration name to compare
     */
    isWantedConfig(fileName, name) {
        const split = fileName.split('.');
        if (split.length !== 2)
            return false;
        return split[0] === name;
    }
    /**
     * Get the contents of a configuration file
     * @param fileName File to load contents from
     */
    getConfigContents(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.readFile(path_1.join(this.configFolder, fileName), 'utf8', (err, data) => {
                    if (err)
                        return reject(new Error('Error reading configuration contents'));
                    resolve(data);
                });
            });
        });
    }
    /**
     * Map a configuration file contents to a Configuration object
     * @param contents The contents to map
     */
    mapConfigContentsToConfiguration(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = null;
            try {
                json = JSON.parse(contents);
            }
            catch (e) {
                return Promise.reject(new Error('Could not parse configuration contents: ' + e.message));
            }
            return Promise.resolve(json);
        });
    }
}
exports.LocalLoader = LocalLoader;
//# sourceMappingURL=LocalLoader.js.map