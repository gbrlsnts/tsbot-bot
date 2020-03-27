"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Factory_1 = require("../../Crawler/Repository/Factory");
class ChannelInactiveNotifyHandler {
    constructor(logger, bot, event) {
        this.logger = logger;
        this.bot = bot;
        this.event = event;
        this.repository = new Factory_1.Factory().create();
    }
    async handle() {
        if (!this.event.icon)
            return;
        const channel = await this.repository.getChannelById(this.event.channelId);
        if (channel.isNotified)
            return;
        await this.bot.setChannelIcon(this.event.channelId, this.event.icon);
        await this.repository.setChannelNotified(this.event.channelId, true);
        this.logger.info('Crawler notified inative channel', {
            canShare: true,
            context: { channelId: this.event.channelId }
        });
    }
}
exports.ChannelInactiveNotifyHandler = ChannelInactiveNotifyHandler;
//# sourceMappingURL=ChannelInactiveNotifyHandler.js.map