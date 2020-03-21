"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PrefixedRoute_1 = require("../../../PrefixedRoute");
const SetConfig_1 = __importDefault(require("./SetConfig"));
const Disable_1 = __importDefault(require("./Disable"));
class CrawlerGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, manager) {
        super();
        this.app = app;
        this.manager = manager;
    }
    /**
     * Register the route
     */
    register() {
        const routes = [
            new SetConfig_1.default(this.app, this.manager),
            new Disable_1.default(this.app, this.manager),
        ];
        routes.forEach(route => route.setPrefix(this.prefix).register());
        return this;
    }
}
exports.CrawlerGroup = CrawlerGroup;
//# sourceMappingURL=CrawlerGroup.js.map