import { UserChannelConfiguration } from "./UserChannelConfiguration";

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