"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const CreateUserChannelAction_1 = require("../../Bot/Action/UserChannel/CreateUserChannelAction");
const UserChannelValidationRules_1 = require("../../Validation/UserChannel/UserChannelValidationRules");
class CreateUserChannelSubscriber {
    constructor(manager) {
        this.manager = manager;
        this.subject = 'bot.server.*.channel.create';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
        this.schema = joi_1.default.object(UserChannelValidationRules_1.createChannel);
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
        return new CreateUserChannelAction_1.CreateUserChannelAction(this.manager.logger, this.manager.bot, msg.data).execute();
    }
}
exports.CreateUserChannelSubscriber = CreateUserChannelSubscriber;
//# sourceMappingURL=CreateUserChannel.js.map