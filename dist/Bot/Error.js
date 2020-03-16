"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotError;
(function (BotError) {
    BotError["GenericBotError"] = "GenericBotError";
    BotError["InvalidConfiguration"] = "InvalidConfiguration";
    BotError["InvalidZone"] = "InvalidZone";
    BotError["InvalidChannel"] = "InvalidChannel";
    BotError["InvalidChannelZone"] = "InvalidChannelZone";
    BotError["InvalidServerGroup"] = "InvalidServerGroup";
    BotError["InvalidClient"] = "InvalidClient";
})(BotError = exports.BotError || (exports.BotError = {}));
exports.genericBotError = () => ({
    type: BotError.GenericBotError,
    reason: 'An unexpected error has ocurred',
});
exports.invalidZoneError = () => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});
exports.invalidConfigurationError = () => ({
    type: BotError.InvalidConfiguration,
    reason: 'The provided configuration is invalid',
});
exports.invalidChannelError = () => ({
    type: BotError.InvalidChannel,
    reason: 'The channel does not exist',
});
exports.invalidChannelZoneError = () => ({
    type: BotError.InvalidChannelZone,
    reason: 'The channel does not exist in the zone',
});
exports.invalidServerGroupError = () => ({
    type: BotError.InvalidServerGroup,
    reason: 'The provided server groups are invalid',
});
exports.invalidClientError = () => ({
    type: BotError.InvalidClient,
    reason: 'The client does not exist',
});
//# sourceMappingURL=Error.js.map