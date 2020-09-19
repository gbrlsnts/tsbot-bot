"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("../../../Lib/Either");
const Error_1 = require("../../Error");
class VerifyUserAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
    }
    /**
     * Execute the action
     */
    async execute() {
        if (!this.bot.isConnected)
            return Either_1.left(Error_1.notConnectedError());
        try {
            await Promise.all(this.data.targets.map(target => this.bot.sendClientMessage(target.clientId, this.formatClientMessage(target.token))));
        }
        catch (e) {
            return Either_1.left(Error_1.genericBotError());
        }
        return Either_1.right(true);
    }
    /**
     * Format the message to send to the client
     * @param token Token to add to the message
     */
    formatClientMessage(token) {
        return this.data.template.replace('{%TOKEN%}', token);
    }
}
exports.default = VerifyUserAction;
//# sourceMappingURL=VerifyUserAction.js.map