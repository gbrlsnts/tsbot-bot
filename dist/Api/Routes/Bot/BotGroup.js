"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerGroup_1 = require("./Server/ServerGroup");
const PrefixedRoute_1 = require("../../PrefixedRoute");
const CrawlerGroup_1 = require("./Crawler/CrawlerGroup");
class BotGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, manager) {
        super();
        this.app = app;
        this.manager = manager;
    }
    register() {
        const groups = [
            new ServerGroup_1.ServerGroup(this.app, this.manager.bot).setPrefix(this.getWithPrefix('/server')),
            new CrawlerGroup_1.CrawlerGroup(this.app, this.manager).setPrefix(this.getWithPrefix('/crawler')),
        ];
        groups.forEach(group => group.register());
        return this;
    }
}
exports.default = BotGroup;
//# sourceMappingURL=BotGroup.js.map