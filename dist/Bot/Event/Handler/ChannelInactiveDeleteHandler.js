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
        await this.deleteSpacerWhenConfigured();
        await this.bot.deleteChannel(channel.cid);
    }
    async deleteSpacerWhenConfigured() {
        const zone = this.config.zones.find(zone => zone.name === this.event.zone);
        if (!(zone && zone.spacerAsSeparator))
            return;
        const allChannelList = await this.bot.getServer().channelList();
        ChannelUtils_1.ChannelUtils
            .getZoneTopChannels(allChannelList, zone.start, zone.end, true)
            .applyOnRight(result => this.getSpacerToDelete(result.channels))
            .applyOnRight(spacer => {
            if (spacer && ChannelUtils_1.ChannelUtils.isChannelSpacer(spacer.name))
                this.bot.deleteChannel(spacer.cid);
        });
    }
    getSpacerToDelete(channelList) {
        const channelId = this.event.channelId;
        let spacer;
        // will be deleting first. remove spacer after when there are more channels
        if (channelId === channelList[0].cid && channelList.length > 1) {
            spacer = channelList[1];
        }
        else {
            spacer = ChannelUtils_1.ChannelUtils.getChannelBefore(channelId, channelList);
        }
        return spacer;
    }
}
exports.ChannelInactiveDeleteHandler = ChannelInactiveDeleteHandler;
//# sourceMappingURL=ChannelInactiveDeleteHandler.js.map