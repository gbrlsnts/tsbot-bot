import { Zone } from '../../../Bot/Action/UserChannel/UserChannelTypes';

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

interface ZoneWithId extends Zone {
    id: number;
}

export interface GetChannelZoneRequest {
    channelId: number;
    zones: ZoneWithId[];
}

export interface GetChannelZoneResponse {
    zoneId?: number;
    existsOutOfZone?: boolean;
}
