export enum ConnectionProtocol {
    RAW = 'raw',
    SSH = 'ssh',
}

export enum BotCodec {
    voice = 'OPUS_VOICE', // opus voice = 4
    music = 'OPUS_MUSIC', // opus music = 5
}

export enum ClientType {
    normal = 'normal',
    query = 'query',
}

export interface ChannelPermission {
    /** The permission id */
    permission: string;
    /** The permission value */
    value: number;
}

export interface SelfInfoData {
    /** self client Id */
    clientId: number;
    /** self database Id */
    databaseId: number;
    /** self unique Id */
    clientUniqueId: string;
    /** connected to this server Id */
    serverId: number;
    /** connected to this server unique Id */
    uniqueServerId: string;
}
