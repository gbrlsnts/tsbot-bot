"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotError;
(function (BotError) {
    BotError["InvalidConfiguration"] = "InvalidConfiguration";
    BotError["InvalidZone"] = "InvalidZone";
})(BotError = exports.BotError || (exports.BotError = {}));
exports.invalidZoneError = () => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});
exports.invalidConfigurationError = () => ({
    type: BotError.InvalidConfiguration,
    reason: 'The provided configuration is invalid',
});
//# sourceMappingURL=Error.js.map