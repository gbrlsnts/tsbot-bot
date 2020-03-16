"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const ChannelAction_1 = require("./ChannelAction");
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
class DeleteUserChannelAction extends ChannelAction_1.ChannelAction {
    constructor(bot, data) {
        super();
        this.bot = bot;
        this.data = data;
    }
    /**
     * Delete the channel
     */
    async execute() {
        const failure = await this.validateChannel(this.data.channelId);
        if (failure)
            return Library_1.left(failure);
        await Promise.all([
            this.bot.deleteChannel(this.data.channelId, true),
            this.deleteSeparator(),
        ]);
        return Library_1.right(true);
    }
    /**
     * Delete the separator of the channel
     */
    async deleteSeparator() {
        if (!this.data.zone.separators)
            return;
        const channelList = await this.getChannelList();
        const index = channelList.findIndex(c => c.cid === this.data.channelId);
        // not found or deleted a subchannel
        if (index < 0 || channelList[index].pid !== 0)
            return;
        // already validated before, zone will always be valid
        const result = ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, this.data.zone.start, this.data.zone.end, true);
        if (result.isLeft())
            return;
        const posInZone = result.value.channels.findIndex(c => c.cid === this.data.channelId);
        // first. dont remove spacers
        if (posInZone === 0)
            return;
        // delete spacer before
        await this.bot.deleteChannel(result.value.channels[posInZone - 1].cid, true);
    }
    /**
     * Get the channels in the server
     */
    async getChannelList() {
        if (this.channelList)
            return this.channelList;
        this.channelList = await this.getBot().getServer().channelList();
        return this.channelList;
    }
    /**
     * Get the server bot instance
     */
    getBot() {
        return this.bot;
    }
    /**
     * Get the action data
     */
    getData() {
        return this.data;
    }
}
exports.DeleteUserChannelAction = DeleteUserChannelAction;
//# sourceMappingURL=DeleteUserChannelAction.js.map