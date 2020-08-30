"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateUserChannelAction_1 = require("../../Bot/Action/UserChannel/CreateUserChannelAction");
class CreateUserChannelHandler {
    constructor(manager) {
        this.manager = manager;
    }
    getSubject() {
        return CreateUserChannelHandler.subject;
    }
    handle(msg) {
        return new CreateUserChannelAction_1.CreateUserChannelAction(this.manager.logger, this.manager.bot, msg).execute();
    }
}
exports.CreateUserChannelHandler = CreateUserChannelHandler;
CreateUserChannelHandler.subject = 'bot.server.*.channel.create';
//# sourceMappingURL=CreateUserChannel.js.map