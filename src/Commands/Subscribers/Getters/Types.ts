export interface ChannelIdRequest {
    channelId: number;
}

export interface ValidateChannelUniqueRequest {
    channels: string[];
    rootChannelId?: number;
}

export interface GetIconResult {
    iconId: number;
    content: string;
}

export declare type GetIconsResult = GetIconResult[];