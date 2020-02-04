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
    loadConfiguration(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = new FileJson_1.default(path_1.join(this.configFolder, `${name}.cfg`));
            return file.loadFileJson();
        });
    }
}
exports.LocalLoader = LocalLoader;
//# sourceMappingURL=LocalLoader.js.map