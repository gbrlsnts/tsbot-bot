"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerGroup_1 = require("./Server/ServerGroup");
const PrefixedRoute_1 = require("../../PrefixedRoute");
class BotGroup extends PrefixedRoute_1.PrefixedRoute {
    constructor(app, bot) {
        super();
        this.app = app;
        this.bot = bot;
    }
    register() {
        new ServerGroup_1.ServerGroup(this.app, this.bot).setPrefix(this.getWithPrefix('/server')).register();
        return this;
    }
}
exports.BotGroup = BotGroup;
//# sourceMappingURL=BotGroup.js.map