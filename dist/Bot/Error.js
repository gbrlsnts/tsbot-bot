"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotError;
(function (BotError) {
    BotError["InvalidZone"] = "InvalidZone";
})(BotError = exports.BotError || (exports.BotError = {}));
exports.invalidZoneError = () => ({
    type: BotError.InvalidZone,
    reason: 'The start or end channels doesn\'t exist',
});
//# sourceMappingURL=Error.js.map