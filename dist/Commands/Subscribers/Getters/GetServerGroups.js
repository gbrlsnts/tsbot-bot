"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../../Bot/Error");
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const Types_1 = require("./Types");
const SharedRules_1 = require("../../../Validation/SharedRules");
class GetGroupsSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.server-groups.get';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.bot = manager.bot;
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return SharedRules_1.tsGroupType;
    }
    async handle(msg) {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        switch (msg.data) {
            case Types_1.TsGroupType.SERVER:
                return Library_1.right(await this.getServerGroups());
            case Types_1.TsGroupType.CHANNEL:
                return Library_1.right(await this.getChannelGroups());
            default:
                return Library_1.right([]);
        }
    }
    async getServerGroups() {
        const groups = await this.bot.getServer().serverGroupList({
            type: ts3_nodejs_library_1.ClientType.ServerQuery,
        });
        return groups.map(g => ({
            tsId: g.sgid,
            iconId: this.normalizeIconId(g.iconid),
            name: g.name,
        }));
    }
    async getChannelGroups() {
        const groups = await this.bot.getServer().channelGroupList({
            type: ts3_nodejs_library_1.ClientType.ServerQuery,
        });
        return groups.map(g => ({
            tsId: g.cgid,
            iconId: this.normalizeIconId(g.iconid),
            name: g.name,
        }));
    }
    normalizeIconId(id) {
        // 0xf: fix bug with teamspeak icon IDs being negative
        return id !== 0 ? id >>> 0 : undefined;
    }
}
exports.GetGroupsSubscriber = GetGroupsSubscriber;
//# sourceMappingURL=GetServerGroups.js.map