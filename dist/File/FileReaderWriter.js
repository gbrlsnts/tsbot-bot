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
class FileReaderWriter {
    constructor(filePath) {
        this.filePath = filePath;
    }
    /**
     * Try to validate the file by accessing it
     */
    checkFile() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.access(this.filePath, (err) => {
                    if (err) {
                        return reject(new Error(err.message));
                    }
                    resolve();
                });
            });
        });
    }
    /**
     * Get the contents of a json file
     * @param fileName File to load contents from
     */
    getFileContents() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.readFile(this.filePath, 'utf8', (err, data) => {
                    if (err)
                        return reject(new Error('Error reading file contents'));
                    resolve(data);
                });
            });
        });
    }
    /**
     * Write the contents to a file
     * @param fileName File to load contents from
     */
    writeFileContents(contents) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.writeFile(this.filePath, contents, (err) => {
                    if (err)
                        return reject(new Error('Error writing file contents'));
                    resolve();
                });
            });
        });
    }
}
exports.default = FileReaderWriter;
//# sourceMappingURL=FileReaderWriter.js.map