"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelInactiveDeleteHandler {
    constructor(bot, event) {
        this.bot = bot;
        this.event = event;
    }
    async handle() {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);
        if (!channel)
            return;
        // todo: need to delete spacer separator if there's only one channel
        this.bot.deleteChannel(channel.cid);
    }
}
exports.ChannelInactiveDeleteHandler = ChannelInactiveDeleteHandler;
//# sourceMappingURL=ChannelInactiveDeleteHandler.js.map