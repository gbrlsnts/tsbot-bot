import { Failure } from "../Lib/Failure";

export enum BotError {
    InvalidZone = "InvalidZone",
}

export const invalidZoneError = (): Failure<BotError.InvalidZone> => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});