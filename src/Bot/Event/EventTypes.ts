export interface ChannelInactiveDeleteEvent
{
    /** Inactive channel to delete */
    channelId: number;
}

export interface ChannelInactiveNotifyEvent
{
    /** Inactive channel to delete */
    channelId: number;

    /** Icon to set on the channel */
    icon?: number;
}