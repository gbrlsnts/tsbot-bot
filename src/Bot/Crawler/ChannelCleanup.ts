import { CrawlZone } from "../Configuration/Configuration";
import { Bot } from "../Bot";
import { CrawlerChannel, ZoneProcessResult } from "./CrawlerTypes";
import { ChannelUtils } from "../Utils/ChannelUtils";
import { TeamSpeakChannel } from "ts3-nodejs-library";

export class ChannelCleanup {

    constructor(private readonly bot: Bot, private readonly config: CrawlZone[], private readonly processResult: ZoneProcessResult[]) {

    }

    /**
     * Clean up inactive channels. returns the channels effectively deleted in the server
     */
    async cleanupChannels(): Promise<number[]>
    {
        const deletedChannels: number[] = [];
        const channelIds = await this.getChannelIds();

        channelIds.forEach(async id => {
            await this.bot.deleteChannel(id);
            deletedChannels.push(id);
        });

        return deletedChannels;
    }

    /**
     * Get the channel ids to delete
     */
    private async getChannelIds(): Promise<number[]>
    {
        const serverChannels = await this.bot.getServer().channelList();
        const deleteIds: number[] = [];

        this.processResult.forEach(({ zone, toDelete }) => {

            const zoneConfig = this.config.find(z => z.name === zone);

            if(!(zoneConfig && zoneConfig.spacerAsSeparator))
                return;

            ChannelUtils
                .getZoneTopChannels(serverChannels, zoneConfig.start, zoneConfig.end, true)
                .applyOnRight(zoneChannels => {
                    toDelete.forEach(channel => {
                        deleteIds.push(channel.channelId);
        
                        if(!zoneConfig.spacerAsSeparator)
                            return;
        
                        const lastChannelNotDeleted = this.getLastChannelNotDeleted(toDelete, zoneChannels.channels);

                        this.getSpacersToDelete(channel.channelId, lastChannelNotDeleted, toDelete, zoneChannels.channels)
                            .forEach(spacer => deleteIds.push(spacer.cid));
                    });                    
                });
        });

        return deleteIds;
    }

    /**
     * Get the spacers associated to zone. Use only when spacer is configured as separator
     * @param channelId The channel id to find the associated spacer
     * @param channelList The zone channel list
     */
    private getSpacersToDelete(
            channelId: number,
            lastUndeletedChannel: TeamSpeakChannel | undefined,
            toDelete: CrawlerChannel[],
            channelList: TeamSpeakChannel[]
        ): TeamSpeakChannel[]
    {
        const spacers: TeamSpeakChannel[] = [];

        if(channelList.length < 1)
            return spacers;

        const channelPos = channelList.findIndex(channel => channel.cid === channelId);

        if(channelPos < 0)
            return spacers;

        if(channelPos > 1) {
            const previousChannel = channelList[channelPos - 2];
            const previousSpacer =  channelList[channelPos - 1];

            // when previous is to not be deleted, add the spacer as well for the last undeleted channel
            if(ChannelUtils.isChannelSpacer(previousSpacer.name) &&
                !ChannelUtils.isChannelSpacer(previousChannel.name) &&
                previousChannel.cid === lastUndeletedChannel?.cid &&
                !toDelete.find(del => del.channelId === previousChannel.cid)) {
                spacers.push(previousSpacer);
            }
        }

        const nextSpacer =  channelList[channelPos + 1];

        if(nextSpacer && ChannelUtils.isChannelSpacer(nextSpacer.name))
            spacers.push(nextSpacer);

        return spacers;
    }

    /**
     * Get the last channel in a zone that won't be deleted
     * @param toDelete The channels to be deleted
     * @param channelList All channels in a zone
     */
    private getLastChannelNotDeleted(toDelete: CrawlerChannel[], channelList: TeamSpeakChannel[]): TeamSpeakChannel | undefined
    {
        let last: TeamSpeakChannel | undefined;

        for(const channel of channelList) {
            if(ChannelUtils.isChannelSpacer(channel.name))
                continue;

            const del = toDelete.find(d => d.channelId === channel.cid);

            if(!del)
                last = channel;
        }

        return last;
    }
}