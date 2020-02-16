"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomstring_1 = require("randomstring");
const ChannelUtils_1 = require("../../Utils/ChannelUtils");
const Either_1 = require("../../../Lib/Either");
const Error_1 = require("../../Error");
class CreateUserChannelAction {
    constructor(bot, data) {
        this.bot = bot;
        this.data = data;
        this.spacerFormat = '[*spacer%d]=';
    }
    /**
     * Execute the action
     */
    async execute() {
        const zoneChannels = await this.getUserChannelZone();
        // zone is invalid
        if (zoneChannels.isLeft()) {
            return Either_1.left(Error_1.invalidZoneError());
        }
        const userChannels = await this.createChannelsHierarchy(zoneChannels.value.channels.pop() || zoneChannels.value.start);
        this.setUserChannelAdminGroup(userChannels);
        return this.getResultData(userChannels);
    }
    /**
     * Get the channels in the zone to creat the user channel
     */
    async getUserChannelZone() {
        const channelList = await this.bot.getServer().channelList();
        return ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, this.data.userChannelStart, this.data.userChannelEnd);
    }
    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    async createChannelsHierarchy(createAfterChannel) {
        let spacer = null, channels = [];
        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;
            if (channelBefore.cid !== this.data.userChannelStart) {
                spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                channelBefore = spacer;
            }
            for (let createChannelData of this.data.channels) {
                const channel = await this.bot.createChannel(createChannelData.name, createChannelData.password, undefined, channelBefore.cid);
                channels.push(channel);
                channelBefore = channel;
                for (let createSubChannelData of createChannelData.channels) {
                    const subChannel = await this.bot.createChannel(createSubChannelData.name, createSubChannelData.password, channel.cid);
                    channels.push(subChannel);
                }
            }
        }
        catch (e) {
            const toDelete = channels;
            if (spacer != null)
                toDelete.push(spacer);
            this.cleanUpCreatedChannels(toDelete);
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }
        return channels;
    }
    /**
     * Sets channel admin group for a user for the given channels
     * @param channels Channels to apply the group
     */
    setUserChannelAdminGroup(channels) {
        const owner = this.data.owner, group = this.data.channelGroupToAssign;
        if (!owner || !group) {
            return;
        }
        channels.forEach(channel => {
            this.bot.setChannelGroupToClient(owner, channel.cid, group)
                .catch(e => console.warn('Warning! Could not set channel group of id ' + group));
        });
    }
    /**
     * Get the spacer name for the separator
     */
    getSpacerName() {
        return this.spacerFormat.replace('%d', randomstring_1.generate(6));
    }
    /**
     * Clean up channels by deleting them
     */
    cleanUpCreatedChannels(channels) {
        try {
            channels.forEach(c => this.bot.deleteChannel(c.cid, true));
        }
        catch (e) {
            console.error(`Error cleaning up channels: ${e.message}`);
        }
    }
    /**
     * Get the result data
     */
    getResultData(channelList) {
        const channel = channelList[0].cid;
        const subchannels = channelList.slice(1).map(c => c.cid);
        return Either_1.right({
            channel,
            subchannels,
        });
    }
}
exports.CreateUserChannelAction = CreateUserChannelAction;
//# sourceMappingURL=CreateUserChannelAction.js.map