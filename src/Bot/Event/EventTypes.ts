export interface ChannelInactiveDeleteEvent
{
    /** Inactive channel to delete */
    channelId: number;

    /** Zone the channel belongs to */
    zone: string;
}

export interface ChannelInactiveNotifyEvent
{
    /** Inactive channel to delete */
    channelId: number;

    /** Zone the channel belongs to */
    zone: string;

    /** Icon to set on the channel */
    icon?: number;
}