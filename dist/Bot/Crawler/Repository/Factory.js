"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalRepository_1 = require("./LocalRepository");
const path_1 = require("path");
class Factory {
    /**
     * Create the repository object
     */
    create() {
        return new LocalRepository_1.LocalRepository(path_1.resolve('database'));
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map