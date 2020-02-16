import { Failure } from "../Lib/Failure";

export enum BotError {
    InvalidConfiguration = "InvalidConfiguration",
    InvalidZone = "InvalidZone",
}

export const invalidZoneError = (): Failure<BotError.InvalidZone> => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});

export const invalidConfigurationError = (): Failure<BotError.InvalidConfiguration> => ({
    type: BotError.InvalidConfiguration,
    reason: 'The provided configuration is invalid',
});