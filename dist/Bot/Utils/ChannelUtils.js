"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelUtils {
    /**
     * Get all top level channels that are between 2 channels
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getTopChannelsBetween(allChannels, start, end, includeSpacers = true) {
        let hasStart = false, hasEnd = false, channels = [];
        for (let channel of allChannels) {
            if (channel.pid !== 0) {
                continue;
            }
            if (channel.cid === start) {
                hasStart = true;
            }
            if (channel.cid === end) {
                hasEnd = true;
                break;
            }
            if (hasStart && channel.cid !== start && channel.cid !== end &&
                (includeSpacers || (!includeSpacers && !this.isChannelSpacer(channel.name)))) {
                channels.push(channel);
            }
        }
        return {
            hasStart,
            hasEnd,
            channels
        };
    }
    /**
     * Get all subchannels in a channel
     * @param channel The channel to get all sub channels
     * @param channelList The server channel list
     */
    static getAllSubchannels(channel, channelList) {
        const subChannelList = [];
        channelList
            .filter(channelToFilter => channelToFilter.pid === channel.cid)
            .forEach(subChannel => {
            const children = this.getAllSubchannels(subChannel, channelList);
            subChannelList.push(subChannel, ...children);
        });
        return subChannelList;
    }
    /**
     * Counts the total clients for a given channel and subchannels
     * @param channel Channel to count clients
     * @param channelList List with all server channels
     */
    static countChannelTreeTotalClients(channel, channelList) {
        const subTotalClients = this.getAllSubchannels(channel, channelList)
            .map(sub => sub.totalClients)
            .reduce((accumulator, current) => accumulator + current);
        return channel.totalClients + subTotalClients;
    }
    /**
     * Check if a given channel name is a spacer
     * @param channelName The channel name to check
     */
    static isChannelSpacer(channelName) {
        return this.spacerRegex.test(channelName);
    }
    /**
     * Get the channel before the specified channel
     * @param channelId The channel Id to find the previous channel
     */
    static getChannelBefore(channelId, channelList) {
        let channelBefore;
        for (let channel of channelList) {
            if (channel.cid === channelId)
                break;
            channelBefore = channel;
        }
        return channelBefore;
    }
}
exports.ChannelUtils = ChannelUtils;
ChannelUtils.spacerRegex = new RegExp('\[[\*lcr]spacer.*\].*');
//# sourceMappingURL=ChannelUtils.js.map