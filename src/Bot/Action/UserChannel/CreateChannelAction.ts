import { TeamSpeakChannel } from "ts3-nodejs-library";
import { CreateChannelParameters, CreateChannelRecursiveResult, ChannelProperties, CreateChannelData } from "./UserChannelTypes";
import { ChannelPermission } from "../../Types";
import { ChannelAction } from "./ChannelAction";

export abstract class CreateChannelAction extends ChannelAction
{
    private createdChannels: TeamSpeakChannel[] = [];

    /**
     * Create a channel, apply configurations and other options according to the parameters
     * @param params Parameters to create the channel 
     */
    protected async createUserChannel({ config, parent, after }: CreateChannelParameters): Promise<CreateChannelRecursiveResult>
    {
        const subChannels: TeamSpeakChannel[] = [];
        const props = this.getProperties(config.properties);

        const channel = await this.getBot().createChannel({
            name: config.name,
            password: config.password,
            parent,
            afterChannel: after,
            codec: props.audio?.codec,
            codec_quality: props.audio?.quality
        });

        this.createdChannels.push(channel);

        if(this.getData().permissions || config.permissions)
            await this.applyPermissions(channel, config.permissions);

        if(config.channels) {
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
    private async applyPermissions(channel: TeamSpeakChannel, permissions?: ChannelPermission[]): Promise<void>
    {
        const globalPerms = this.getData().permissions || [];
        const localPerms = permissions || [];

        await this.getBot().setChannelPermissions(channel.cid, [...globalPerms, ...localPerms]);
    }

    /**
     * Get a list of properties to apply in a channel. Merges with the properties configured at the top level for all channels.
     * @param properties The properties of the channel
     */
    private getProperties(properties?: ChannelProperties): ChannelProperties
    {
        const globalProps = this.getData().properties || {};
        const localProps = properties || {};

        return {...globalProps, ...localProps};
    }
    
    /**
     * Sets channel admin group for a user for the given channels
     * @param channels Channels to apply the group
     */
    protected setUserChannelAdminGroup(channels: TeamSpeakChannel[])
    {
        const { owner, group } = this.getData();

        if(!owner || !group) {
            return;
        }

        channels.forEach(channel => {
            this.getBot().setChannelGroupToClient(owner, channel.cid, group)
                .catch(e => console.warn('Warning! Could not set channel group of id ' + group));
        });
    }

    /**
     * Clean up channels by deleting them
     */
    protected cleanUpCreatedChannels(channels: TeamSpeakChannel[])
    {
        try {
            channels.forEach(c => this.getBot().deleteChannel(c.cid, true));
        } catch (e) {
            console.error(`Error cleaning up channels: ${e.message}`);
        }
        
    }

    /**
     * Get the created channels list
     */
    protected getCreatedChannels(): TeamSpeakChannel[]
    {
        return this.createdChannels;
    }

    /**
     * Get the action data
     */
    abstract getData(): CreateChannelData;
}