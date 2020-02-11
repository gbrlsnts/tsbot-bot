import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelInactiveNotifyEvent } from "../EventTypes";
import { RepositoryInterface } from "../../Crawler/Repository/RepositoryInterface";
import { Factory } from "../../Crawler/Repository/Factory";

export class ChannelInactiveNotifyHandler implements EventHandlerInterface
{
    readonly repository: RepositoryInterface;

    constructor(private readonly bot: Bot, private readonly event: ChannelInactiveNotifyEvent)
    {
        this.repository = new Factory().create();
    }

    async handle(): Promise<void> {
        if(!this.event.icon)
            return;

        const channel = await this.repository.getChannelById(this.event.channelId);

        if(channel.isNotified)
            return;

        await this.bot.setChannelIcon(this.event.channelId, this.event.icon);
        await this.repository.setChannelNotified(this.event.channelId, true);
    }
}