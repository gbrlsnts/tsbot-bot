"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const UserChannelValidationRules_1 = require("../../Validation/UserChannel/UserChannelValidationRules");
const DeleteUserChannelAction_1 = require("../../Bot/Action/UserChannel/DeleteUserChannelAction");
class DeleteUserChannelSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.channel.delete';
        this.schema = joi_1.default.object(UserChannelValidationRules_1.deleteChannel);
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return this.schema;
    }
    handle(msg) {
        return new DeleteUserChannelAction_1.DeleteUserChannelAction(this.manager.logger, this.manager.bot, msg).execute();
    }
}
exports.DeleteUserChannelSubscriber = DeleteUserChannelSubscriber;
//# sourceMappingURL=DeleteUserChannel.js.map