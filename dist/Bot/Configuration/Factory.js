"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalLoader_1 = require("./LocalLoader");
class Factory {
    constructor(opts) {
        this.opts = opts;
    }
    create() {
        return new LocalLoader_1.LocalLoader(this.opts.configFolder);
    }
}
exports.Factory = Factory;
//# sourceMappingURL=Factory.js.map