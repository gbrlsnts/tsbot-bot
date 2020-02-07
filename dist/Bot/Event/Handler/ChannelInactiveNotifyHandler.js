"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelInactiveNotifyHandler {
    constructor(bot, event) {
        this.bot = bot;
        this.event = event;
    }
    async handle() {
        if (!this.event.icon)
            return;
        // todo: set is notified flag in the repository as well
        await this.bot.setChannelIcon(this.event.channelId, this.event.icon);
    }
}
exports.ChannelInactiveNotifyHandler = ChannelInactiveNotifyHandler;
//# sourceMappingURL=ChannelInactiveNotifyHandler.js.map