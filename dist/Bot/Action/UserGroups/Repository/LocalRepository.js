"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const FileJson_1 = __importDefault(require("../../../../File/FileJson"));
class LocalRepository {
    constructor(databasePath) {
        this.databasePath = databasePath;
        this.groupsFilePath = path_1.join(this.databasePath, 'usergroups.json');
    }
    /**
     * Get the allowed user groups
     */
    async getUserGroups() {
        const loader = await this.getFileLoader(this.groupsFilePath);
        return loader.loadFileJson();
    }
    /**
     * Get the fileloader. Initialize an empty file if it doesn't exist
     * @param filePath Path to the data file
     */
    async getFileLoader(filePath) {
        const loader = new FileJson_1.default(filePath);
        loader.setBaseContents('[]');
        await loader.initializeFile();
        return loader;
    }
}
exports.LocalRepository = LocalRepository;
//# sourceMappingURL=LocalRepository.js.map