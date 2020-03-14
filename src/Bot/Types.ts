export enum ConnectionProtocol
{
    RAW = 'raw',
    SSH = 'ssh'
}

export enum BotCodec
{
    voice = "voice", // opus voice = 4
    music = "music", // opus music = 5
}

export enum ClientType
{
    normal = "normal",
    query = "query",
}

export interface ChannelPermission
{
    /** The permission id */
    permission: string;
    /** The permission value */
    value: number;
}