export interface CreateUserChannelResponse
{
    /** Id of the newly created top channel */
    channel: number;
    /** Ids of channel's subchannels */
    subchannels: number[];
}

export interface ClientResponse
{
    /** Client Id */
    id: number;
    /** Channel Id */
    channelId: number;
    /** Database Id */
    databaseId: number;
    /** Unique Id */
    uid: string;
    /** Nickname Id */
    nickname: string;
    /** Server groups */
    serverGroupsId: number[];
    /** Channel group */
    channelGroupId: number;
    /** Ip address */
    ip: string;
}