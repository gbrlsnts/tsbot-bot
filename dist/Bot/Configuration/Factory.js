"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const LocalLoader_1 = require("./LocalLoader");
class Factory {
    create() {
        return new LocalLoader_1.LocalLoader(path_1.resolve('server_configs'));
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map