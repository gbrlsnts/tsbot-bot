"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Manager {
    constructor(components) {
        this.components = components;
    }
    get bot() {
        return this.components.bot;
    }
    get eventHandler() {
        return this.components.eventHandler;
    }
    get crawler() {
        return this.components.crawler;
    }
}
exports.default = Manager;
//# sourceMappingURL=Manager.js.map