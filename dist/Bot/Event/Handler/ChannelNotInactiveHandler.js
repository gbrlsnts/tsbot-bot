"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelNotInactiveHandler {
    constructor(bot, event) {
        this.bot = bot;
        this.event = event;
    }
    async handle() {
        await this.bot.removeChannelIcon(this.event.channelId);
    }
}
exports.ChannelNotInactiveHandler = ChannelNotInactiveHandler;
//# sourceMappingURL=ChannelNotInactiveHandler.js.map