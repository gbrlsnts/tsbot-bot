import { TeamSpeakChannel } from "ts3-nodejs-library";
import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ZoneChannelEvent } from "../EventTypes";
import { CrawlerConfiguration } from "../../Configuration/Configuration";
import { ChannelUtils } from "../../Utils/ChannelUtils";

export class ChannelInactiveDeleteHandler implements EventHandlerInterface
{
    constructor(
        private readonly bot: Bot,
        private readonly config: CrawlerConfiguration,
        private readonly event: ZoneChannelEvent
    )
    {

    }

    async handle(): Promise<void>
    {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);
        
        if(!channel)
            return;

        await this.deleteSpacerWhenConfigured();
        await this.bot.deleteChannel(channel.cid);
    }

    private async deleteSpacerWhenConfigured()
    {
        const zone = this.config.zones.find(zone => zone.name === this.event.zone);

        if(!(zone && zone.spacerAsSeparator))
            return;


        const allChannelList = await this.bot.getServer().channelList();

        ChannelUtils
            .getZoneTopChannels(allChannelList, zone.start, zone.end, true)
            .applyOnRight(result => this.getSpacerToDelete(result.channels))
            .applyOnRight(async spacer => {
                if(spacer && ChannelUtils.isChannelSpacer(spacer.name))
                    await this.bot.deleteChannel(spacer.cid);
            });
    }

    private getSpacerToDelete(channelList: TeamSpeakChannel[]): TeamSpeakChannel | undefined
    {
        const channelId = this.event.channelId;
        let spacer;

        // will be deleting first. remove spacer after when there are more channels
        if(channelId === channelList[0].cid && channelList.length > 1) {
            spacer = channelList[1];
        } else {
            spacer = ChannelUtils.getChannelBefore(channelId, channelList);
        }

        return spacer;
    }
}