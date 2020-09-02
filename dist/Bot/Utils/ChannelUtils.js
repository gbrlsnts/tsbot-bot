"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts3_nodejs_library_1 = require("ts3-nodejs-library");
const Either_1 = require("../../Lib/Either");
const Error_1 = require("../Error");
class ChannelUtils {
    /**
     * Get all top level channels that are in a zone
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getZoneTopChannels(allChannels, start, end, includeSeparators = true) {
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
            if (startChannel &&
                channel.cid !== start &&
                channel.cid !== end &&
                (includeSeparators ||
                    (!includeSeparators &&
                        !this.isChannelSeparator(channel, allChannels)))) {
                channels.push(channel);
            }
        }
        if (!startChannel || !endChannel)
            return Either_1.left(Error_1.invalidZoneError());
        return Either_1.right({
            start: startChannel,
            end: endChannel,
            channels,
        });
    }
    /**
     * Get all subchannels in a channel
     * @param channel The channel to get all sub channels
     * @param channelList The server channel list
     */
    static getAllSubchannels(channel, channelList) {
        const channelId = channel instanceof ts3_nodejs_library_1.TeamSpeakChannel ? channel.cid : channel;
        const subChannelList = [];
        channelList
            .filter(channelToFilter => channelToFilter.pid === channelId)
            .forEach(subChannel => {
            const children = this.getAllSubchannels(subChannel, channelList);
            subChannelList.push(subChannel, ...children);
        });
        return subChannelList;
    }
    /**
     * Find the root/top channel of a given subchannel
     * @param channel The subchannel
     * @param channelList The server channellist
     */
    static getRootChannelBySubChannel(channel, channelList) {
        if (channel.pid === 0)
            return channel;
        const parent = channelList.find(c => c.cid === channel.pid);
        if (!parent)
            throw new Error('Unable to find parent in channel list');
        return this.getRootChannelBySubChannel(parent, channelList);
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
     * Check is a root/top channel
     * @param ChannelId The channel name to check
     */
    static isRootChannel(channel) {
        return channel.pid === 0;
    }
    /**
     * Check if a given channel name is a spacer
     * @param channelName The channel name to check
     */
    static isChannelSpacer(channelName) {
        return this.spacerRegex.test(channelName);
    }
    /**
     * Check if a given channel name is a separator (spacer + no subchannels)
     * @param channel Channel to check
     * @param channelList List with all server channels
     */
    static isChannelSeparator(channel, channelList) {
        return (this.isChannelSpacer(channel.name) &&
            this.getAllSubchannels(channel, channelList).length === 0);
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
ChannelUtils.spacerRegex = new RegExp('[[*lcr]spacer.*].*');
//# sourceMappingURL=ChannelUtils.js.map