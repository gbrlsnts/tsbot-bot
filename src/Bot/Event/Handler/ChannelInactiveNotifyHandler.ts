import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelInactiveNotifyEvent } from "../EventTypes";

export class ChannelInactiveNotifyHandler implements EventHandlerInterface
{
    constructor(private readonly bot: Bot, private readonly event: ChannelInactiveNotifyEvent)
    {

    }

    async handle(): Promise<void> {
        if(!this.event.icon)
            return;

        // todo: set is notified flag in the repository as well
        await this.bot.setChannelIcon(this.event.channelId, this.event.icon);
    }
}