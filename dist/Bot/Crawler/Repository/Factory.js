"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const LocalRepository_1 = require("./LocalRepository");
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