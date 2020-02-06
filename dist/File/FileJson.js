"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileReaderWriter_1 = __importDefault(require("./FileReaderWriter"));
class FileJson extends FileReaderWriter_1.default {
    constructor(filePath) {
        super(filePath);
        this.setBaseContents('{}');
    }
    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    async loadFileJson() {
        await this.checkFile();
        const contents = await this.getFileContents();
        return this.mapContentsToType(contents);
    }
    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    async saveFileJson(object) {
        await this.checkFile();
        const contents = await this.mapTypeToContents(object);
        await this.writeFileContents(contents);
    }
    /**
     * Map a file contents to a @type <T> object
     * @param contents The contents to map
     */
    async mapContentsToType(contents) {
        let json = null;
        try {
            json = JSON.parse(contents);
        }
        catch (e) {
            return Promise.reject(new Error('Could not parse file contents: ' + e.message));
        }
        return Promise.resolve(json);
    }
    /**
     * Map @type <T> object to contents
     * @param contents The object to map
     */
    async mapTypeToContents(object) {
        let contents = null;
        try {
            contents = JSON.stringify(object, null, 4);
        }
        catch (e) {
            return Promise.reject(new Error('Could stringify object: ' + e.message));
        }
        return Promise.resolve(contents);
    }
    /**
     * Initialize an empty file
     * @param force Write empty file even if it already exists
     */
    async initializeFile(force = false) {
        return super.initializeFile(force);
    }
}
exports.default = FileJson;
//# sourceMappingURL=FileJson.js.map