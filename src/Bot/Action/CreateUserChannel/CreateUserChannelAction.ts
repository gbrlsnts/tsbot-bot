import { generate } from "randomstring";
import { TeamSpeakChannel } from "ts3-nodejs-library";
import { ActionInterface } from "../Action";
import { Bot } from "../../Bot";
import { ChannelUtils, ZoneChannelsResult } from "../../Utils/ChannelUtils";
import { Either, right, left } from "../../../Lib/Either";
import { Failure } from "../../../Lib/Failure";
import { BotError, invalidZoneError } from "../../Error";
import { CreateUserChannelData, CreateUserChannelResultData } from "./CreateUserChannelTypes";

export class CreateUserChannelAction implements ActionInterface<CreateUserChannelResultData>
{
    readonly spacerFormat: string = '[*spacer%d]=';

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
            this.data.userChannelStart,
            this.data.userChannelEnd
        );
    }

    /**
     * Create a user channel hierarchy (top and subchannels)
     * @param createAfterChannel The new channel will be placed after this channel
     */
    private async createChannelsHierarchy(createAfterChannel: TeamSpeakChannel): Promise<TeamSpeakChannel[]>
    {
        let spacer: TeamSpeakChannel | null = null, 
            channels: TeamSpeakChannel[] = [];

        try {
            const spacerName = this.getSpacerName();
            let channelBefore = createAfterChannel;

            if(channelBefore.cid !== this.data.userChannelStart) {
                spacer = await this.bot.createSpacer(spacerName, channelBefore.cid);
                channelBefore = spacer;
            }

            for(let createChannelData of this.data.channels) {
                const channel = await this.bot.createChannel(
                    createChannelData.name,
                    createChannelData.password,
                    undefined,
                    channelBefore.cid
                );

                channels.push(channel);
                channelBefore = channel;

                for(let createSubChannelData of createChannelData.channels) {
                    const subChannel = await this.bot.createChannel(
                        createSubChannelData.name,
                        createSubChannelData.password,
                        channel.cid
                    );

                    channels.push(subChannel);
                }
            }
        } catch(e) {
            const toDelete = channels;

            if(spacer != null)
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
    private setUserChannelAdminGroup(channels: TeamSpeakChannel[])
    {
        const owner = this.data.owner,
            group = this.data.channelGroupToAssign;

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