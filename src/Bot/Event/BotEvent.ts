import { EventEmitter } from "events";
import { ChannelInactiveDeleteEvent, ChannelInactiveNotifyEvent } from "./EventTypes";

export class BotEvent extends EventEmitter
{
    raiseChannelNotInactiveNotify(channelId: number, zone: string)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId, zone });
    }

    raiseChannelInactiveNotify(channelId: number, zone: string, icon?: number)
    {
        this.emit(BotEventName.channelInactiveNotifyEvent, { channelId, zone, icon });
    }

    raiseChannelInactiveDelete(channelId: number, zone: string)
    {
        this.emit(BotEventName.channelInactiveDeleteEvent, { channelId, zone });
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