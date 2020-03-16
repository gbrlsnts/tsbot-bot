"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Library_1 = require("../../../Lib/Library");
const CreateChannelAction_1 = require("./CreateChannelAction");
class CreateUserSubChannelAction extends CreateChannelAction_1.CreateChannelAction {
    constructor(bot, data) {
        super();
        this.bot = bot;
        this.data = data;
    }
    /**
     * Create the user sub channel
     */
    async execute() {
        const failure = await this.validateChannel(this.data.channelId);
        if (failure)
            return Library_1.left(failure);
        await this.createSubChannel();
        this.setUserChannelAdminGroup(this.getCreatedChannels());
        return Library_1.right({
            channels: this.getCreatedChannels().map(channel => channel.cid)
        });
    }
    /**
     * Create sub channels in the request
     */
    async createSubChannel() {
        try {
            for (const config of this.data.channels) {
                await this.createUserChannel({ config, parent: this.data.channelId });
            }
        }
        catch (e) {
            this.cleanUpCreatedChannels(this.getCreatedChannels());
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }
    }
    /**
     * Get the channels in the server
     */
    async getChannelList() {
        return this.getBot().getServer().channelList();
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
exports.CreateUserSubChannelAction = CreateUserSubChannelAction;
//# sourceMappingURL=CreateUserSubChannelAction.js.map