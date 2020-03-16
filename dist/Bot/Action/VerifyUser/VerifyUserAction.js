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
        return '\n[color=green][b]Verification Token[/b][/color]\n\n' +
            'Please use this token to get [b]verified[/b] in our website:\n---------\n' +
            `${token}\n---------\n` +
            '[color=red]Please ignore if you aren\'t trying to verify your account. [b]Do not give to anyone![/b][/color]';
    }
}
exports.default = VerifyUserAction;
//# sourceMappingURL=VerifyUserAction.js.map