"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Either_1 = require("../../Lib/Either");
const Error_1 = require("../Error");
class ChannelUtils {
    /**
     * Get all top level channels that are in a zone
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getZoneTopChannels(allChannels, start, end, includeSpacers = true) {
        let startChannel, endChannel, channels = [];
        for (let channel of allChannels) {
            if (channel.pid !== 0) {
                continue;
            }
            if (channel.cid === start) {
                startChannel = channel;
            }
            if (channel.cid === end) {
                endChannel = channel;
                break;
            }
            if (startChannel && channel.cid !== start && channel.cid !== end &&
                (includeSpacers || (!includeSpacers && !this.isChannelSpacer(channel.name)))) {
                channels.push(channel);
            }
        }
        if (!startChannel || !endChannel)
            return Either_1.left(Error_1.invalidZoneError());
        return Either_1.right({
            start: startChannel,
            end: endChannel,
            channels
        });
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