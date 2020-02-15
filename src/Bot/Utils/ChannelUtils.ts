import { TeamSpeakChannel } from "ts3-nodejs-library";
import { Either, left, right } from "../../Lib/Either";
import { BotError, invalidZoneError } from "../Error";
import { Failure } from "../../Lib/Failure";

export class ChannelUtils
{

    private static spacerRegex = new RegExp('\[[\*lcr]spacer.*\].*');

    /**
     * Get all top level channels that are in a zone
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getZoneTopChannels(allChannels: TeamSpeakChannel[], start: number, end: number, includeSpacers: boolean = true): 
        Either<Failure<BotError.InvalidZone>, ZoneChannelsResult>
    {
        let startChannel: TeamSpeakChannel | undefined,
            endChannel: TeamSpeakChannel | undefined,
            channels: TeamSpeakChannel[] = [];

        for(let channel of allChannels) {
            if(channel.pid !== 0) {
                continue;
            }

            if(channel.cid === start) {
                startChannel = channel;
            }
                
            if(channel.cid === end) {
                endChannel = channel;
                break;
            }

            if(startChannel && channel.cid !== start && channel.cid !== end &&
                (includeSpacers || (!includeSpacers && !this.isChannelSpacer(channel.name)))
                ) {
                channels.push(channel);
            }
        }

        if(!startChannel || !endChannel)
            return left(invalidZoneError());

        return right({
            start: startChannel,
            end: endChannel,
            channels
        });
    }

    /**
     * Get all subchannels in a channel
     * @param channel The channel to get all sub channels
     * @param channelList The server channel list
     */
    static getAllSubchannels(channel: TeamSpeakChannel, channelList: TeamSpeakChannel[]): TeamSpeakChannel[]
    {
        const subChannelList: TeamSpeakChannel[] = [];

        channelList
            .filter(channelToFilter => channelToFilter.pid === channel.cid)
            .forEach(subChannel => {
                const children = this.getAllSubchannels(subChannel, channelList);

                subChannelList.push(subChannel, ...children);
            });

        return subChannelList;
    }

    /**
     * Counts the total clients for a given channel and subchannels
     * @param channel Channel to count clients
     * @param channelList List with all server channels
     */
    static countChannelTreeTotalClients(channel: TeamSpeakChannel, channelList: TeamSpeakChannel[]): number
    {
        const subTotalClients = this.getAllSubchannels(channel, channelList)
                    .map(sub => sub.totalClients)
                    .reduce((accumulator, current) => accumulator + current);

        return channel.totalClients + subTotalClients;
    }

    /**
     * Check if a given channel name is a spacer
     * @param channelName The channel name to check
     */
    static isChannelSpacer(channelName: string): boolean
    {
        return this.spacerRegex.test(channelName);
    }

    /**
     * Get the channel before the specified channel
     * @param channelId The channel Id to find the previous channel
     */
    static getChannelBefore(channelId: number, channelList: TeamSpeakChannel[]): TeamSpeakChannel | undefined
    {
        let channelBefore: TeamSpeakChannel | undefined;

        for(let channel of channelList) {
            if(channel.cid === channelId)
                break;

            channelBefore = channel;
        }

        return channelBefore;
    }
}

export interface ZoneChannelsResult {
    /** the start channel delimiter */
    start: TeamSpeakChannel,
    /** the end channel delimiter */
    end: TeamSpeakChannel,
    /** channels between start and end */
    channels: TeamSpeakChannel[],
}