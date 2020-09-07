"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const SetUserGroupsAction_1 = __importDefault(require("../../../Bot/Action/UserGroups/SetUserGroupsAction"));
const UserGroups_1 = require("../../../Validation/UserGroups");
class SetUserGroupsSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.badges.set';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(UserGroups_1.setUserGroupsCommand);
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return this.schema;
    }
    handle(msg) {
        return new SetUserGroupsAction_1.default(this.manager.bot, {
            ...msg.data,
            trustedSource: true,
        }).execute();
    }
}
exports.SetUserGroupsSubscriber = SetUserGroupsSubscriber;
//# sourceMappingURL=SetUserGroups.js.map