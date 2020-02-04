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
const FileReaderWriter_1 = __importDefault(require("./FileReaderWriter"));
class FileJson extends FileReaderWriter_1.default {
    constructor(filePath) {
        super(filePath);
    }
    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    loadFileJson() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkFile();
            const contents = yield this.getFileContents();
            return this.mapContentsToType(contents);
        });
    }
    /**
     * Load a file as json and map to a type
     * @param filePath Path to the file
     */
    saveFileJson(object) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkFile();
            const contents = yield this.mapTypeToContents(object);
            yield this.writeFileContents(contents);
        });
    }
    /**
     * Map a file contents to a @type <T> object
     * @param contents The contents to map
     */
    mapContentsToType(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = null;
            try {
                json = JSON.parse(contents);
            }
            catch (e) {
                return Promise.reject(new Error('Could not parse file contents: ' + e.message));
            }
            return Promise.resolve(json);
        });
    }
    /**
     * Map @type <T> object to contents
     * @param contents The object to map
     */
    mapTypeToContents(object) {
        return __awaiter(this, void 0, void 0, function* () {
            let contents = null;
            try {
                contents = JSON.stringify(object);
            }
            catch (e) {
                return Promise.reject(new Error('Could stringify object: ' + e.message));
            }
            return Promise.resolve(contents);
        });
    }
}
exports.default = FileJson;
//# sourceMappingURL=FileJson.js.map