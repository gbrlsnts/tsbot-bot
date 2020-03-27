"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelInactiveDeleteHandler {
    constructor(logger, event) {
        this.logger = logger;
        this.event = event;
    }
    async handle() {
        this.logger.info('Crawler deleted inactive channel', {
            canShare: true,
            context: {
                channelId: this.event.channelId
            }
        });
    }
}
exports.ChannelInactiveDeleteHandler = ChannelInactiveDeleteHandler;
//# sourceMappingURL=ChannelInactiveDeleteHandler.js.map