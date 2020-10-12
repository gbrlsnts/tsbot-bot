export interface ChannelEvent {
    /** Triggered event's channel */
    channelId: number;
}

export interface ZoneChannelEvent extends ChannelEvent {
    /** Zone the channel belongs to */
    zone: string;
}

export interface ChannelInactiveNotifyEvent extends ZoneChannelEvent {
    /** Icon to set on the channel */
    icon?: number;
}

export interface BotConnectionLostEvent {}
