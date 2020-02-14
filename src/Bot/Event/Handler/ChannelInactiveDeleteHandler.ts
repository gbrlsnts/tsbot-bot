import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelInactiveDeleteEvent } from "../EventTypes";
import { CrawlerConfiguration } from "../../Configuration/Configuration";
import { ChannelUtils } from "../../Utils/ChannelUtils";

export class ChannelInactiveDeleteHandler implements EventHandlerInterface
{
    constructor(
        private readonly bot: Bot,
        private readonly config: CrawlerConfiguration,
        private readonly event: ChannelInactiveDeleteEvent
    )
    {

    }

    async handle(): Promise<void> {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);
        
        if(!channel)
            return;

        const zone = this.config.zones.find(zone => zone.name === this.event.zone);

        if(zone && zone.spacerAsSeparator) {
            const allChannelList = await this.bot.getServer().channelList();

            const zoneChannelList = ChannelUtils.getTopChannelsBetween(allChannelList, zone.start, zone.end, true);

            let spacer;
            // will be deleting first. remove spacer after when there are more channels
            if(channel.cid === zoneChannelList.channels[0].cid && zoneChannelList.channels.length > 1) {
                spacer = zoneChannelList.channels[1];
            } else {
                spacer = ChannelUtils.getChannelBefore(channel.cid, zoneChannelList.channels);
            }

            if(spacer && ChannelUtils.isChannelSpacer(spacer.name))
                this.bot.deleteChannel(spacer.cid);
        }

        this.bot.deleteChannel(channel.cid);
    }
}