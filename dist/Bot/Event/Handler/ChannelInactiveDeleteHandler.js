"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelInactiveDeleteHandler {
    constructor(event) {
        this.event = event;
    }
    async handle() {
        console.log('Dummy delete event', this.event.channelId);
    }
}
exports.ChannelInactiveDeleteHandler = ChannelInactiveDeleteHandler;
//# sourceMappingURL=ChannelInactiveDeleteHandler.js.map