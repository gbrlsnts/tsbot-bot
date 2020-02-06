"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const FileJson_1 = __importDefault(require("../../File/FileJson"));
class LocalLoader {
    constructor(configFolder) {
        this.configFolder = configFolder;
    }
    /**
     * Load a server configuration for the bot to use
     * @param name The configuration name
     */
    async loadConfiguration(name) {
        const file = new FileJson_1.default(path_1.join(this.configFolder, `${name}.cfg`));
        return file.loadFileJson();
    }
}
exports.LocalLoader = LocalLoader;
//# sourceMappingURL=LocalLoader.js.map