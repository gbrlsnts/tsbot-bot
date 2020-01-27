export interface UserChannelConfiguration
{
    /** The channel name */
    name: string;
    /** The channel password, optional */
    password?: string;
    /** Sub channels configurations to create for this channel */
    channels: UserChannelConfiguration[];
}