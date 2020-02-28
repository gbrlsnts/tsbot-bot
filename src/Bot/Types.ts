export enum ConnectionProtocol
{
    RAW = 'raw',
    SSH = 'ssh'
}

export enum Codec
{
    music = "music",
    voice = "voice",
}

export interface ChannelPermission
{
    /** The permission id */
    permission: string;
    /** The permission value */
    value: number;
}