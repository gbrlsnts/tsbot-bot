"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const CreateUserSubChannelAction_1 = require("../../../Bot/Action/UserChannel/CreateUserSubChannelAction");
const UserChannelValidationRules_1 = require("../../../Validation/UserChannel/UserChannelValidationRules");
class CreateUserSubChannelSubscriber {
    constructor() {
        this.subject = 'bot.server.*.channel.sub.create';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(UserChannelValidationRules_1.createSubChannel);
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
    handle(botManager, msg) {
        return new CreateUserSubChannelAction_1.CreateUserSubChannelAction(botManager.logger, botManager.bot, msg.data).execute();
    }
}
exports.CreateUserSubChannelSubscriber = CreateUserSubChannelSubscriber;
//# sourceMappingURL=CreateUserSubChannel.js.map