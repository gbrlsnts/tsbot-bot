"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotError;
(function (BotError) {
    BotError["InvalidConfiguration"] = "InvalidConfiguration";
    BotError["InvalidZone"] = "InvalidZone";
    BotError["InvalidChannel"] = "InvalidChannel";
    BotError["InvalidChannelZone"] = "InvalidChannelZone";
})(BotError = exports.BotError || (exports.BotError = {}));
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
//# sourceMappingURL=Error.js.map