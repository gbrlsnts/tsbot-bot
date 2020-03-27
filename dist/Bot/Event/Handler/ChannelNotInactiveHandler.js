"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelNotInactiveHandler {
    constructor(logger, bot, event) {
        this.logger = logger;
        this.bot = bot;
        this.event = event;
    }
    async handle() {
        await this.bot.removeChannelIcon(this.event.channelId);
        this.logger.info('Crawler removed inactive channel notify icon', {
            canShare: true,
            context: { channelId: this.event.channelId }
        });
    }
}
exports.ChannelNotInactiveHandler = ChannelNotInactiveHandler;
//# sourceMappingURL=ChannelNotInactiveHandler.js.map