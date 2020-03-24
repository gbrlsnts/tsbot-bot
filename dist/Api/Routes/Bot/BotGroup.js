"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerGroup_1 = require("./Server/ServerGroup");
const PrefixedRoute_1 = require("../../PrefixedRoute");
const CrawlerGroup_1 = require("./Crawler/CrawlerGroup");
class BotGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, manager, logger) {
        super();
        this.app = app;
        this.manager = manager;
        this.logger = logger;
    }
    register() {
        const groups = [
            new ServerGroup_1.ServerGroup(this.app, this.manager.bot, this.logger).setPrefix(this.getWithPrefix('/server')),
            new CrawlerGroup_1.CrawlerGroup(this.app, this.manager, this.logger).setPrefix(this.getWithPrefix('/crawler')),
        ];
        groups.forEach(group => group.register());
        return this;
    }
}
exports.default = BotGroup;
//# sourceMappingURL=BotGroup.js.map