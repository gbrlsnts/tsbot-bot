export interface ChannelIdRequest {
    channelId: number;
}

export interface ValidateChannelUniqueRequest {
    channels: string[];
    rootChannelId?: number;
}
