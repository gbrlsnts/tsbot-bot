"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomstring_1 = require("randomstring");
const Either_1 = require("../../../Lib/Either");
const Error_1 = require("../../Error");
const CreateChannelAction_1 = require("./CreateChannelAction");
class CreateUserChannelAction extends CreateChannelAction_1.CreateChannelAction {
    constructor(logger, bot, data) {
        super(logger, bot);
        this.data = data;
        this.spacerFormat = '[*spacer%d]=';
    }
    /**
     * Execute the action
     */
    async execute() {
        if (!this.bot.isConnected)
            return Either_1.left(Error_1.notConnectedError());
        const failure = await this.validateAction();
        if (failure)
            return Either_1.left(failure);
        const zoneChannels = await this.getUserChannelZone(await this.getChannelList());
        // zone is invalid
        if (zoneChannels.isLeft()) {
            return Either_1.left(Error_1.invalidZoneError());
        }
        const userChannels = await this.createChannelsHierarchy(zoneChannels.value.channels.pop() || zoneChannels.value.start);
        this.setUserChannelAdminGroup(userChannels);
        return this.getResultData(userChannels);
    }
    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    async createChannelsHierarchy(createAfterChannel) {
        let spacer;
        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;
            if (this.data.zone.separators && channelBefore.cid !== this.data.zone.start) {
                spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                channelBefore = spacer;
            }
            for (const config of this.data.channels) {
                const result = await this.createUserChannel({ config, after: channelBefore.cid });
                channelBefore = result.channel;
            }
        }
        catch (e) {
            this.cleanUpCreatedChannels(spacer ? [spacer, ...this.getCreatedChannels()] : this.getCreatedChannels());
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }
        return this.getCreatedChannels();
    }
    /**
     * Get the spacer name for the separator
     */
    getSpacerName() {
        return this.spacerFormat.replace('%d', randomstring_1.generate(6));
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
    /**
     * Get the action data
     */
    getData() {
        return this.data;
    }
}
exports.CreateUserChannelAction = CreateUserChannelAction;
//# sourceMappingURL=CreateUserChannelAction.js.map