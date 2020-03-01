import { generate } from "randomstring";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ActionInterface } from "../Action";
import { Bot } from "../../Bot";
import { ChannelUtils, ZoneChannelsResult } from "../../Utils/ChannelUtils";
import { Either, right, left } from "../../../Lib/Either";
import { Failure } from "../../../Lib/Failure";
import { BotError, invalidZoneError } from "../../Error";
import { CreateUserChannelData, CreateUserChannelResultData, UserChannelConfiguration } from "./CreateUserChannelTypes";
import { ChannelPermission } from "../../Types";

export class CreateUserChannelAction implements ActionInterface<CreateUserChannelResultData>
{
    readonly spacerFormat: string = '[*spacer%d]=';
    private createdChannels: TeamSpeakChannel[] = [];

    constructor(private bot: Bot, readonly data: CreateUserChannelData)
    {
        
    }

    /**
     * Execute the action
     */
    async execute(): Promise<Either<Failure<BotError>, CreateUserChannelResultData>> {
        const zoneChannels = await this.getUserChannelZone();

        // zone is invalid
        if(zoneChannels.isLeft()) {
            return left(invalidZoneError());
        }

        const userChannels = await this.createChannelsHierarchy(
            zoneChannels.value.channels.pop() || zoneChannels.value.start
        );

        this.setUserChannelAdminGroup(userChannels);

        return this.getResultData(userChannels);
    }

    /**
     * Get the channels in the zone to creat the user channel
     */
    private async getUserChannelZone(): Promise<Either<Failure<BotError>, ZoneChannelsResult>>
    {
        const channelList = await this.bot.getServer().channelList();

        return ChannelUtils.getZoneTopChannels(
            channelList,
            this.data.zone.start,
            this.data.zone.end
        );
    }

    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    private async createChannelsHierarchy(createAfterChannel: TeamSpeakChannel): Promise<TeamSpeakChannel[]>
    {
        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;

            if(channelBefore.cid !== this.data.zone.start) {
                const spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                this.createdChannels.push(spacer);
                channelBefore = spacer;
            }

            for(let config of this.data.channels) {
                const result = await this.createUserChannel({ config, after: channelBefore.cid }, )
                channelBefore = result.channel;
            }
        } catch(e) {
            this.cleanUpCreatedChannels(this.createdChannels);
            
            return Promise.reject(new Error(`Error while creating channels: ${e.message}`));
        }

        return this.createdChannels;
    }

    /**
     * Create a channel, apply configurations and other options according to the parameters
     * @param params Parameters to create the channel 
     */
    private async createUserChannel({ config, parent, after }: CreateChannelParameters): Promise<CreateChannelRecursiveResult>
    {
        const subChannels: TeamSpeakChannel[] = [];
        const channel = await this.bot.createChannel(
            config.name,
            config.password,
            parent,
            after
        );

        this.createdChannels.push(channel);

        if(this.data.permissions || config.permissions)
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
        const globalPerms = this.data.permissions || [];
        const localPerms = permissions || [];

        await this.bot.setChannelPermissions(channel.cid, [...globalPerms, ...localPerms]);
    }
    
    /**
     * Sets channel admin group for a user for the given channels
     * @param channels Channels to apply the group
     */
    private setUserChannelAdminGroup(channels: TeamSpeakChannel[])
    {
        const { owner, group } = this.data;

        if(!owner || !group) {
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
    private getSpacerName(): string
    {
        return this.spacerFormat.replace('%d', generate(6));
    }

    /**
     * Clean up channels by deleting them
     */
    private cleanUpCreatedChannels(channels: TeamSpeakChannel[])
    {
        try {
            channels.forEach(c => this.bot.deleteChannel(c.cid, true));
        } catch (e) {
            console.error(`Error cleaning up channels: ${e.message}`);
        }
        
    }

    /**
     * Get the result data
     */
    private getResultData(channelList: TeamSpeakChannel[]): Either<Failure<BotError>, CreateUserChannelResultData>
    {
        const channel = channelList[0].cid;
        const subchannels = channelList.slice(1).map(c => c.cid);

        return right({
            channel,
            subchannels,
        });
    }
}

interface CreateChannelParameters
{
    /** Channel configuration */
    config: UserChannelConfiguration;
    /** Parent channel */
    parent?: number;
    /** Create new channel after this channel */
    after?: number;
}

interface CreateChannelRecursiveResult
{
    /** The created parent channel */
    channel: TeamSpeakChannel;
    /** The created subchannels */
    subChannels: TeamSpeakChannel[];
}