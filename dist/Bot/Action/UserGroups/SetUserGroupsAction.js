"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../Error");
const Factory_1 = require("./Repository/Factory");
class SetUserGroupsAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
        this.repository = new Factory_1.Factory().create();
    }
    /**
     * Execute the action
     */
    async execute() {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
        const allowedGroups = await this.repository.getUserGroups();
        if (!this.validateGroups(allowedGroups))
            return Library_1.left(Error_1.invalidServerGroupError());
        const client = await this.bot.getClientByDatabaseId(this.data.clientDatabaseId);
        if (!client)
            return Library_1.left(Error_1.invalidClientError());
        const { toAdd, toRemove } = this.getGroupsToChange(client.servergroups || [], allowedGroups);
        await Promise.all([
            this.bot.clientAddServerGroups(client.databaseId, toAdd),
            this.bot.clientRemoveServerGroups(client.databaseId, toRemove)
        ]);
        return Library_1.right(true);
    }
    /**
     * Validate if all groups are allowed
     */
    validateGroups(allowedGroups) {
        return this.data.groups.every(group => {
            return allowedGroups.findIndex(allowed => allowed === group) >= 0;
        });
    }
    /**
     * Retrieve the groups to add and remove of a client
     * @param clientGroups current groups of the client
     */
    getGroupsToChange(clientGroups, allowedGroups) {
        const clientAllowedGroups = lodash_1.default.intersection(clientGroups, allowedGroups);
        const toAdd = lodash_1.default.difference(this.data.groups, clientAllowedGroups);
        const toRemove = lodash_1.default.difference(clientAllowedGroups, this.data.groups);
        return {
            toAdd,
            toRemove,
        };
    }
}
exports.default = SetUserGroupsAction;
//# sourceMappingURL=SetUserGroupsAction.js.map