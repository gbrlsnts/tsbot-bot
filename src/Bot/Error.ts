import { Failure } from "../Lib/Failure";

export enum BotError {
    GenericBotError = "GenericBotError",
    InvalidConfiguration = "InvalidConfiguration",
    InvalidZone = "InvalidZone",
    InvalidChannel = "InvalidChannel",
    InvalidChannelZone = "InvalidChannelZone",
    InvalidServerGroup = "InvalidServerGroup",
    InvalidClient = "InvalidClient",
}

export const genericBotError = (): Failure<BotError.GenericBotError> => ({
    type: BotError.GenericBotError,
    reason: 'An unexpected error has ocurred',
});

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

export const invalidServerGroupError = (): Failure<BotError.InvalidServerGroup> => ({
    type: BotError.InvalidServerGroup,
    reason: 'The provided server groups are invalid',
});

export const invalidClientError = (): Failure<BotError.InvalidClient> => ({
    type: BotError.InvalidClient,
    reason: 'The client does not exist',
});