"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelInactiveNotifyHandler {
    constructor(bot, event) {
        this.bot = bot;
        this.event = event;
    }
    async handle() {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);
        if (!channel)
            return;
        this.bot.sendServerMessage(`Channel ${channel.name} is inactive and will be deleted soon!`);
    }
}
exports.ChannelInactiveNotifyHandler = ChannelInactiveNotifyHandler;
//# sourceMappingURL=ChannelInactiveNotifyHandler.js.map