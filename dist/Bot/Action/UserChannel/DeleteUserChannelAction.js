"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const Error_1 = require("../../Error");
const ChannelAction_1 = require("./ChannelAction");
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
class DeleteUserChannelAction extends ChannelAction_1.ChannelAction {
    constructor(logger, bot, data) {
        super(logger, bot);
        this.data = data;
    }
    /**
     * Delete the channel
     */
    async execute() {
        if (!this.bot.isConnected)
            return Library_1.left(Error_1.notConnectedError());
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
     * Run aditional validations to delete a channel
     * @param channelId The channel to validate
     */
    async validateChannel(channelId) {
        const failure = await super.validateChannel(channelId);
        if (failure)
            return failure;
        const channelList = await this.getChannelList();
        const channel = channelList.find(c => c.cid === channelId);
        // Shouldn't happen has it has been validated by the parent method
        if (!channel)
            return Error_1.invalidChannelError();
        if (channel.pid === 0)
            return;
        if (!this.data.rootChannelId)
            return Error_1.deletingNoRootChannelError();
        const root = ChannelUtils_1.ChannelUtils.getRootChannelBySubChannel(channel, channelList);
        if (root.cid !== this.data.rootChannelId)
            return Error_1.subchannelDoesntBelongToRootError();
        if (channel.pid === root.cid &&
            ChannelUtils_1.ChannelUtils.getAllSubchannels(root, channelList).length === 1)
            return Error_1.onlyOneSubchannelError();
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