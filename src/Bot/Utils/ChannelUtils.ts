import { TeamSpeakChannel } from "ts3-nodejs-library";

export class ChannelUtils
{

    private static spacerRegex = new RegExp('\[[\*lcr]spacer.*\].*');

    /**
     * Get all top level channels that are between 2 channels
     * @param start Start channel Id
     * @param end End channel Id
     */
    static getTopChannelsBetween(allChannels: TeamSpeakChannel[], start: number, end: number): ChannelsBetweenResult
    {
        let hasStart = false,
            hasEnd = false,
            channels: TeamSpeakChannel[] = [];

        for(let channel of allChannels) {
            if(channel.pid !== 0) {
                continue;
            }

            if(channel.cid === start) {
                hasStart = true;
            }
                
            if(channel.cid === end) {
                hasEnd = true;
                break;
            }

            if(hasStart && channel.cid !== start && channel.cid !== end) {
                channels.push(channel);
            }
        }

        return {
            hasStart,
            hasEnd,
            channels
        };
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
}

export interface ChannelsBetweenResult {
    /** If the start was found in the specified range */
    hasStart: boolean,
    /** If the end was found in the specified range */
    hasEnd: boolean,
    /** The channels between start and end */
    channels: TeamSpeakChannel[]
}