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
            if (hasStart) {
                channels.push(channel);
            }
            if (channel.cid === start) {
                hasStart = true;
            }
            if (channel.cid === end) {
                hasEnd = true;
                break;
            }
        }
        return {
            hasStart,
            hasEnd,
            channels
        };
    }
}
exports.ChannelUtils = ChannelUtils;
//# sourceMappingURL=ChannelUtils.js.map