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

        for(const id of channelIds) {
            await this.bot.deleteChannel(id);
            deletedChannels.push(id);
        }

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
        
                        const lastChannelNotDeleted = this.getLastChannelNotDeleted(toDelete, zoneChannels.channels, serverChannels);

                        this.getSpacersToDelete(channel.channelId, lastChannelNotDeleted, toDelete, zoneChannels.channels, serverChannels)
                            .forEach(spacer => deleteIds.push(spacer.cid));
                    });                    
                });
        });

        return deleteIds;
    }

    /**
     * Get the spacers associated to zone. Use only when spacer is configured as separator
     * @param channelId The channel id to find the associated spacer
     * @param zoneChannelList The zone channel list
     */
    private getSpacersToDelete(
            channelId: number,
            lastUndeletedChannel: TeamSpeakChannel | undefined,
            toDelete: CrawlerChannel[],
            zoneChannelList: TeamSpeakChannel[],
            serverChannelList: TeamSpeakChannel[],
        ): TeamSpeakChannel[]
    {
        const spacers: TeamSpeakChannel[] = [];

        if(zoneChannelList.length < 1)
            return spacers;

        const channelPos = zoneChannelList.findIndex(channel => channel.cid === channelId);

        if(channelPos < 0)
            return spacers;

        if(channelPos > 1) {
            const previousChannel = zoneChannelList[channelPos - 2];
            const previousSpacer =  zoneChannelList[channelPos - 1];

            // when previous is to not be deleted, add the spacer as well for the last undeleted channel
            if(ChannelUtils.isChannelSeparator(previousSpacer, serverChannelList) &&
                !ChannelUtils.isChannelSeparator(previousChannel, serverChannelList) &&
                previousChannel.cid === lastUndeletedChannel?.cid &&
                !toDelete.find(del => del.channelId === previousChannel.cid)) {
                spacers.push(previousSpacer);
            }
        }

        const nextSpacer =  zoneChannelList[channelPos + 1];

        if(nextSpacer && ChannelUtils.isChannelSeparator(nextSpacer, serverChannelList))
            spacers.push(nextSpacer);

        return spacers;
    }

    /**
     * Get the last channel in a zone that won't be deleted
     * @param toDelete The channels to be deleted
     * @param zoneChannelList All channels in a zone
     */
    private getLastChannelNotDeleted(
        toDelete: CrawlerChannel[],
        zoneChannelList: TeamSpeakChannel[],
        serverChannelList: TeamSpeakChannel[]
    ): TeamSpeakChannel | undefined
    {
        let last: TeamSpeakChannel | undefined;

        for(const channel of zoneChannelList) {
            if(ChannelUtils.isChannelSeparator(channel, serverChannelList))
                continue;

            const del = toDelete.find(d => d.channelId === channel.cid);

            if(!del)
                last = channel;
        }

        return last;
    }
}