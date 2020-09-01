import { TeamSpeakChannel } from 'ts3-nodejs-library';
import { BotCodec, ChannelPermission } from '../../Types';

export interface ZoneChannel {
    /** The zone where channel is/will be located */
    zone: Zone;
}

export interface CreateChannelData extends ZoneChannel {
    /** The channels configuration which will be created for the user */
    channels: UserChannelConfiguration[];
    /** Channels' owner database Id */
    owner?: number;
    /** Channel group to assign, if any. Owner must be defined */
    group?: number;
    /** Permissions to assign to all channels created by the action */
    permissions?: ChannelPermission[];
    /** Properties to apply to all channels created by the action */
    properties?: ChannelProperties;
}

export interface CreateUserChannelData extends CreateChannelData {}

export interface CreateSubChannelData extends CreateChannelData {
    /** Parent to create sub channel */
    channelId: number;
}

export interface DeleteChannelData extends ZoneChannel {
    /** Channel to delete */
    channelId: number;
    /** When deleting a subchannel, the root channel is mandatory for validation */
    rootChannelId?: number;
}

export interface UserChannelConfiguration {
    /** The channel name */
    name: string;
    /** The channel password, optional */
    password?: string;
    /** Sub channels configurations to create for this channel */
    channels: UserChannelConfiguration[];
    /** Permissions to assign to this channel */
    permissions?: ChannelPermission[];
    /** Properties to apply to the channel */
    properties?: ChannelProperties;
}

export interface ChannelProperties {
    /** Audio quality */
    audio?: AudioQuality;
}

export interface AudioQuality {
    /** Codec to set */
    codec: BotCodec;
    /** Quality, 0 to 10 */
    quality: number;
}

export interface Zone {
    /** Channel id where the zone starts */
    start: number;
    /** Channel id where the zone ends */
    end: number;
    /** If channel separators are enabled for this zone */
    separators: boolean;
}

export interface CreateUserChannelResultData {
    /** Id of the newly created top channel */
    channel: number;
    /** Ids of channel's subchannels */
    subchannels: number[];
}

export interface CreateUserSubChannelResultData {
    /** The created channels id */
    channels: number[];
}

export interface CreateChannelParameters {
    /** Channel configuration */
    config: UserChannelConfiguration;
    /** Parent channel */
    parent?: number;
    /** Create new channel after this channel */
    after?: number;
}

export interface CreateChannelRecursiveResult {
    /** The created parent channel */
    channel: TeamSpeakChannel;
    /** The created subchannels */
    subChannels: TeamSpeakChannel[];
}
