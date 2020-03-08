"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Error_1 = require("../../Error");
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
class ChannelAction {
    /**
     * Get the channels in the zone to creat the user channel
     */
    async getUserChannelZone(channelList) {
        const data = this.getData();
        return ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, data.zone.start, data.zone.end);
    }
    /**
     * Validates that the given channel Id exists in the zone
     */
    async validateChannel(channelId) {
        const channelList = await this.getChannelList();
        const channel = channelList.find(c => c.cid === channelId);
        // channel doesnt exist in the server
        if (!channel)
            return Error_1.invalidChannelError();
        const rootChannel = ChannelUtils_1.ChannelUtils.getRootChannelBySubChannel(channel, channelList);
        const zoneIndex = (await this.getUserChannelZone(channelList))
            .applyOnRight(result => result.channels.findIndex(c => c.cid === rootChannel.cid));
        // zone is invalid
        if (zoneIndex.isLeft())
            return Error_1.invalidZoneError();
        // channel doesnt exist in zone
        if (zoneIndex.value < 0)
            return Error_1.invalidChannelZoneError();
    }
}
exports.ChannelAction = ChannelAction;
//# sourceMappingURL=ChannelAction.js.map