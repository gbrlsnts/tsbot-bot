"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChannelUtils {
    /**
     * Get all top level channels that are between 2 channels
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getTopChannelsBetween(allChannels, start, end) {
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
            if (hasStart && channel.cid !== start && channel.cid !== end) {
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
     * Check if a given channel name is a spacer
     * @param channelName The channel name to check
     */
    static isChannelSpacer(channelName) {
        return this.spacerRegex.test(channelName);
    }
}
exports.ChannelUtils = ChannelUtils;
ChannelUtils.spacerRegex = new RegExp('\[[\*lcr]spacer.*\].*');
//# sourceMappingURL=ChannelUtils.js.map