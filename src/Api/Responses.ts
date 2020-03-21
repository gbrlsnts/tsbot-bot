export interface CreateUserChannelResponse
{
    /** Id of the newly created top channel */
    channel: number;
    /** Ids of channel's subchannels */
    subchannels: number[];
}

export interface AllInfoResponse
{
    server?: ServerResponse,
    serverGroups?: ServerGroupResponse[],
    clients?: ClientResponse[],
    channels?: ChannelResponse[],
}

export interface ServerResponse
{
    /** Server unique identifier */
    uniqueId: string;
    /** Server name */
    name: string;
    /** Server status */
    status: string;
    /** Server max clients */
    maxClients: number;
    /** Server icon id */
    iconId: number;
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

export interface ChannelResponse
{
    /** Channel id */
    id: number;
    /** Channel parent id */
    pid: number;
    /** Channel name */
    name: string;
    /** Channel tree order */
    order: number;
}

export interface ServerGroupResponse
{
    /** Server group id */
    id: number;
    /** Server group name */
    name: string;
    /** Icon id */
    iconId: number;
    /** Group sort order */
    order: number;
}