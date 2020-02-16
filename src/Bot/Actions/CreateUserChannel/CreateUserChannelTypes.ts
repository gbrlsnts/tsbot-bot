export interface CreateUserChannelData
{
    /** Channel id where the intended user channel area starts */
    userChannelStart: number,
    /** Channel id where the intended user channel area ends */
    userChannelEnd: number,
    /** The channels configuration which will be created for the user */
    channels: UserChannelConfiguration[];
    /** Channels' owner database Id */
    owner?: number;
    /** Channel group to assign, if any. Owner must be defined */
    channelGroupToAssign?: number;
}

export interface UserChannelConfiguration
{
    /** The channel name */
    name: string;
    /** The channel password, optional */
    password?: string;
    /** Sub channels configurations to create for this channel */
    channels: UserChannelConfiguration[];
}

export interface CreateUserChannelResultData {
    /** Id of the newly created top channel */
    channel: number;
    /** Ids of channel's subchannels */
    subchannels: number[];
}