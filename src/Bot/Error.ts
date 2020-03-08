import { Failure } from "../Lib/Failure";

export enum BotError {
    InvalidConfiguration = "InvalidConfiguration",
    InvalidZone = "InvalidZone",
    InvalidChannel = "InvalidChannel",
    InvalidChannelZone = "InvalidChannelZone",
}

export const invalidZoneError = (): Failure<BotError.InvalidZone> => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});

export const invalidConfigurationError = (): Failure<BotError.InvalidConfiguration> => ({
    type: BotError.InvalidConfiguration,
    reason: 'The provided configuration is invalid',
});

export const invalidChannelError = (): Failure<BotError.InvalidChannel> => ({
    type: BotError.InvalidChannel,
    reason: 'The channel does not exist',
});

export const invalidChannelZoneError = (): Failure<BotError.InvalidChannelZone> => ({
    type: BotError.InvalidChannelZone,
    reason: 'The channel does not exist in the zone',
});