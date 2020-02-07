import { EventEmitter } from "events";
import { ChannelInactiveDeleteEvent, ChannelInactiveNotifyEvent } from "./EventTypes";

export class BotEvent extends EventEmitter
{
    raiseChannelNotInactiveNotify(channelId: number)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId });
    }

    raiseChannelInactiveNotify(channelId: number, icon?: number)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId, icon });
    }

    raiseChannelInactiveDelete(channelId: number)
    {
        this.emit(BotEventName.channelInactiveDeleteEvent, { channelId });
    }
}

export interface BotEvent
{
    on(event: 'bot.user.channel.not-inactive.notify', listener: (event: ChannelInactiveDeleteEvent) => void): this;
    on(event: 'bot.user.channel.inactive.notify', listener: (event: ChannelInactiveNotifyEvent) => void): this;
    on(event: 'bot.user.channel.delete.notify', listener: (event: ChannelInactiveDeleteEvent) => void): this;
}

export class BotEventName
{
    static readonly channelNotInactiveNotifyEvent = 'bot.user.channel.not-inactive.notify';
    static readonly channelInactiveNotifyEvent = 'bot.user.channel.inactive.notify';
    static readonly channelInactiveDeleteEvent = 'bot.user.channel.delete.notify';
}