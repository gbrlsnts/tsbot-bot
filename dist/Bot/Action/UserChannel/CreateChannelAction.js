"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChannelAction_1 = require("./ChannelAction");
const Error_1 = require("../../Error");
class CreateChannelAction extends ChannelAction_1.ChannelAction {
    constructor() {
        super(...arguments);
        this.createdChannels = [];
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
        if (this.getData().permissions || config.permissions)
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
     * Validates the action data
     * @param parentId Parent channel for the new channel
     */
    async validateAction(parentId = 0) {
        const data = this.getData();
        const existingNames = [];
        const depthChannelList = (await this.getChannelList())
            .filter(channel => channel.pid === parentId);
        data.channels.forEach(channel => {
            const index = depthChannelList.findIndex(c => c.name === channel.name);
            if (index >= 0)
                existingNames.push(channel.name);
        });
        if (existingNames.length > 0)
            return Error_1.channelNameExistsError(existingNames.join('; '));
    }
    /**
     * Applies a list of permissions to a channel. Merges with the permissions configured at the top level for all channels.
     * @param channel The channel to apply permissions
     * @param permissions The permissions list to apply
     */
    async applyPermissions(channel, permissions) {
        const globalPerms = this.getData().permissions || [];
        const localPerms = permissions || [];
        await this.bot.setChannelPermissions(channel.cid, [...globalPerms, ...localPerms]);
    }
    /**
     * Get a list of properties to apply in a channel. Merges with the properties configured at the top level for all channels.
     * @param properties The properties of the channel
     */
    getProperties(properties) {
        const globalProps = this.getData().properties || {};
        const localProps = properties || {};
        return { ...globalProps, ...localProps };
    }
    /**
     * Sets channel admin group for a user for the given channels
     * @param channels Channels to apply the group
     */
    setUserChannelAdminGroup(channels) {
        const { owner, group } = this.getData();
        if (!owner || !group) {
            return;
        }
        channels.forEach(channel => {
            this.bot.setChannelGroupToClient(owner, channel.cid, group)
                .catch(e => this.logger.warn('Could not set channel admin group', {
                canShare: true,
                context: {
                    clientDatabaseId: owner,
                    channel: channel.cid,
                    groupId: group,
                }
            }));
        });
    }
    /**
     * Clean up channels by deleting them
     */
    cleanUpCreatedChannels(channels) {
        try {
            channels.forEach(c => this.bot.deleteChannel(c.cid, true));
        }
        catch (e) {
            this.logger.error(`Error cleaning up channels`, {
                context: {
                    channels: channels.map(channel => channel.cid),
                },
            });
        }
    }
    /**
     * Get the created channels list
     */
    getCreatedChannels() {
        return this.createdChannels;
    }
}
exports.CreateChannelAction = CreateChannelAction;
//# sourceMappingURL=CreateChannelAction.js.map