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
        this.createdChannels = [];
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
        return ChannelUtils_1.ChannelUtils.getZoneTopChannels(channelList, this.data.zone.start, this.data.zone.end);
    }
    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    async createChannelsHierarchy(createAfterChannel) {
        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;
            if (this.data.zone.separators && channelBefore.cid !== this.data.zone.start) {
                const spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                this.createdChannels.push(spacer);
                channelBefore = spacer;
            }
            for (let config of this.data.channels) {
                const result = await this.createUserChannel({ config, after: channelBefore.cid });
                channelBefore = result.channel;
            }
        }
        catch (e) {
            this.cleanUpCreatedChannels(this.createdChannels);
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }
        // Remove the first when separators are enabled
        return this.data.zone.separators ? this.createdChannels.slice(1) : this.createdChannels;
    }
    /**
     * Create a channel, apply configurations and other options according to the parameters
     * @param params Parameters to create the channel
     */
    async createUserChannel({ config, parent, after }) {
        var _a, _b;
        const subChannels = [];
        const props = this.getProperties(config.properties);
        const channel = await this.bot.createChannel({
            name: config.name,
            password: config.password,
            parent,
            afterChannel: after,
            codec: (_a = props.audio) === null || _a === void 0 ? void 0 : _a.codec,
            codec_quality: (_b = props.audio) === null || _b === void 0 ? void 0 : _b.quality
        });
        this.createdChannels.push(channel);
        if (this.data.permissions || config.permissions)
            await this.applyPermissions(channel, config.permissions);
        if (config.channels) {
            (await Promise.all(config.channels.map(c => this.createUserChannel({ config: c, parent: channel.cid }))))
                .forEach(res => {
                subChannels.push(res.channel, ...res.subChannels);
            });
        }
        return {
            channel,
            subChannels
        };
    }
    /**
     * Applies a list of permissions to a channel. Merges with the permissions configured at the top level for all channels.
     * @param channel The channel to apply permissions
     * @param permissions The permissions list to apply
     */
    async applyPermissions(channel, permissions) {
        const globalPerms = this.data.permissions || [];
        const localPerms = permissions || [];
        await this.bot.setChannelPermissions(channel.cid, [...globalPerms, ...localPerms]);
    }
    /**
     * Get a list of properties to apply in a channel. Merges with the properties configured at the top level for all channels.
     * @param properties The properties of the channel
     */
    getProperties(properties) {
        const globalProps = this.data.properties || {};
        const localProps = properties || {};
        return { ...globalProps, ...localProps };
    }
    /**
     * Sets channel admin group for a user for the given channels
     * @param channels Channels to apply the group
     */
    setUserChannelAdminGroup(channels) {
        const { owner, group } = this.data;
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