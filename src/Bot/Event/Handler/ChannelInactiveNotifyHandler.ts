import { EventHandlerInterface } from "../EventHandlerInterface";
import { Bot } from "../../Bot";
import { ChannelInactiveEvent } from "../EventTypes";

export class ChannelInactiveNotifyHandler implements EventHandlerInterface
{
    constructor(private readonly bot: Bot, private readonly event: ChannelInactiveEvent)
    {

    }

    async handle(): Promise<void> {
        const channel = await this.bot.getServer().getChannelByID(this.event.channelId);

        if(!channel)
            return;

        this.bot.sendServerMessage(`Channel ${channel.name} is inactive and will be deleted soon!`);
    }
}