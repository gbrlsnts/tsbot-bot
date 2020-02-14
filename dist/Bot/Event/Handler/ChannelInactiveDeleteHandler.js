"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
class ChannelInactiveDeleteHandler {
    constructor(bot, config, event) {
        this.bot = bot;
        this.config = config;
        this.event = event;
    }
    async handle() {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);
        if (!channel)
            return;
        const zone = this.config.zones.find(zone => zone.name === this.event.zone);
        if (zone && zone.spacerAsSeparator) {
            const allChannelList = await this.bot.getServer().channelList();
            const zoneChannelList = ChannelUtils_1.ChannelUtils.getTopChannelsBetween(allChannelList, zone.start, zone.end, true);
            let spacer;
            // will be deleting first. remove spacer after when there are more channels
            if (channel.cid === zoneChannelList.channels[0].cid && zoneChannelList.channels.length > 1) {
                spacer = zoneChannelList.channels[1];
            }
            else {
                spacer = ChannelUtils_1.ChannelUtils.getChannelBefore(channel.cid, zoneChannelList.channels);
            }
            if (spacer && ChannelUtils_1.ChannelUtils.isChannelSpacer(spacer.name))
                this.bot.deleteChannel(spacer.cid);
        }
        this.bot.deleteChannel(channel.cid);
    }
}
exports.ChannelInactiveDeleteHandler = ChannelInactiveDeleteHandler;
//# sourceMappingURL=ChannelInactiveDeleteHandler.js.map