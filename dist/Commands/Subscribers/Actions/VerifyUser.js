"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../../Validation/User");
const VerifyUserAction_1 = __importDefault(require("../../../Bot/Action/VerifyUser/VerifyUserAction"));
class VerifyUserSubscriber {
    constructor() {
        this.subject = 'bot.server.*.user.verification';
        this.serverIdPos = this.subject.split('.').findIndex(f => f === '*');
    }
    getServerIdPosition() {
        return this.serverIdPos;
    }
    getSubject() {
        return this.subject;
    }
    getValidationSchema() {
        return User_1.verifyUser;
    }
    handle(botManager, msg) {
        return new VerifyUserAction_1.default(botManager.bot, msg.data).execute();
    }
}
exports.VerifyUserSubscriber = VerifyUserSubscriber;
//# sourceMappingURL=VerifyUser.js.map