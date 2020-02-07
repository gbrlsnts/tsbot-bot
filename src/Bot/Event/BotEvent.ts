import { EventEmitter } from "events";
import { ChannelInactiveEvent } from "./EventTypes";

export class BotEvent extends EventEmitter
{
    raiseChannelNotInactiveNotify(channelId: number)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId });
    }

    raiseChannelInactiveNotify(channelId: number)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId });
    }

    raiseChannelInactiveDelete(channelId: number)
    {
        this.emit(BotEventName.channelInactiveDeleteEvent, { channelId });
    }
}

export interface BotEvent
{
    on(event: 'bot.user.channel.not-inactive.notify', listener: (event: ChannelInactiveEvent) => void): this;
    on(event: 'bot.user.channel.inactive.notify', listener: (event: ChannelInactiveEvent) => void): this;
    on(event: 'bot.user.channel.delete.notify', listener: (event: ChannelInactiveEvent) => void): this;
}

export class BotEventName
{
    static readonly channelNotInactiveNotifyEvent = 'bot.user.channel.not-inactive.notify';
    static readonly channelInactiveNotifyEvent = 'bot.user.channel.inactive.notify';
    static readonly channelInactiveDeleteEvent = 'bot.user.channel.delete.notify';
}