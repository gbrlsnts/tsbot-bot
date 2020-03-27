"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerGroup_1 = require("./Server/ServerGroup");
const PrefixedRoute_1 = require("../../PrefixedRoute");
const CrawlerGroup_1 = require("./Crawler/CrawlerGroup");
class BotGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, manager, globalLogger) {
        super();
        this.app = app;
        this.manager = manager;
        this.globalLogger = globalLogger;
    }
    register() {
        const groups = [
            new ServerGroup_1.ServerGroup(this.app, this.manager, this.globalLogger).setPrefix(this.getWithPrefix('/server')),
            new CrawlerGroup_1.CrawlerGroup(this.app, this.manager, this.globalLogger).setPrefix(this.getWithPrefix('/crawler')),
        ];
        groups.forEach(group => group.register());
        return this;
    }
}
exports.default = BotGroup;
//# sourceMappingURL=BotGroup.js.map