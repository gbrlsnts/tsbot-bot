"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelUtils_1 = require("../Utils/ChannelUtils");
class ChannelCleanup {
    constructor(bot, config, processResult) {
        this.bot = bot;
        this.config = config;
        this.processResult = processResult;
    }
    /**
     * Clean up inactive channels. returns the channels effectively deleted in the server
     */
    async cleanupChannels() {
        const deletedChannels = [];
        const channelIds = await this.getChannelIds();
        channelIds.forEach(async (id) => {
            await this.bot.deleteChannel(id);
            deletedChannels.push(id);
        });
        return deletedChannels;
    }
    /**
     * Get the channel ids to delete
     */
    async getChannelIds() {
        const serverChannels = await this.bot.getServer().channelList();
        const deleteIds = [];
        this.processResult.forEach(({ zone, toDelete }) => {
            const zoneConfig = this.config.find(z => z.name === zone);
            if (!(zoneConfig && zoneConfig.spacerAsSeparator))
                return;
            ChannelUtils_1.ChannelUtils
                .getZoneTopChannels(serverChannels, zoneConfig.start, zoneConfig.end, true)
                .applyOnRight(zoneChannels => {
                toDelete.forEach(channel => {
                    deleteIds.push(channel.channelId);
                    if (!zoneConfig.spacerAsSeparator)
                        return;
                    const lastChannelNotDeleted = this.getLastChannelNotDeleted(toDelete, zoneChannels.channels, serverChannels);
                    this.getSpacersToDelete(channel.channelId, lastChannelNotDeleted, toDelete, zoneChannels.channels, serverChannels)
                        .forEach(spacer => deleteIds.push(spacer.cid));
                });
            });
        });
        return deleteIds;
    }
    /**
     * Get the spacers associated to zone. Use only when spacer is configured as separator
     * @param channelId The channel id to find the associated spacer
     * @param zoneChannelList The zone channel list
     */
    getSpacersToDelete(channelId, lastUndeletedChannel, toDelete, zoneChannelList, serverChannelList) {
        var _a;
        const spacers = [];
        if (zoneChannelList.length < 1)
            return spacers;
        const channelPos = zoneChannelList.findIndex(channel => channel.cid === channelId);
        if (channelPos < 0)
            return spacers;
        if (channelPos > 1) {
            const previousChannel = zoneChannelList[channelPos - 2];
            const previousSpacer = zoneChannelList[channelPos - 1];
            // when previous is to not be deleted, add the spacer as well for the last undeleted channel
            if (ChannelUtils_1.ChannelUtils.isChannelSeparator(previousSpacer, serverChannelList) &&
                !ChannelUtils_1.ChannelUtils.isChannelSeparator(previousChannel, serverChannelList) &&
                previousChannel.cid === ((_a = lastUndeletedChannel) === null || _a === void 0 ? void 0 : _a.cid) &&
                !toDelete.find(del => del.channelId === previousChannel.cid)) {
                spacers.push(previousSpacer);
            }
        }
        const nextSpacer = zoneChannelList[channelPos + 1];
        if (nextSpacer && ChannelUtils_1.ChannelUtils.isChannelSeparator(nextSpacer, serverChannelList))
            spacers.push(nextSpacer);
        return spacers;
    }
    /**
     * Get the last channel in a zone that won't be deleted
     * @param toDelete The channels to be deleted
     * @param zoneChannelList All channels in a zone
     */
    getLastChannelNotDeleted(toDelete, zoneChannelList, serverChannelList) {
        let last;
        for (const channel of zoneChannelList) {
            if (ChannelUtils_1.ChannelUtils.isChannelSeparator(channel, serverChannelList))
                continue;
            const del = toDelete.find(d => d.channelId === channel.cid);
            if (!del)
                last = channel;
        }
        return last;
    }
}
exports.ChannelCleanup = ChannelCleanup;
//# sourceMappingURL=ChannelCleanup.js.map