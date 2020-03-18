"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BotError;
(function (BotError) {
    BotError["GenericBotError"] = "GenericBotError";
    BotError["NotConnected"] = "NotConnected";
    BotError["InvalidConfiguration"] = "InvalidConfiguration";
    BotError["InvalidZone"] = "InvalidZone";
    BotError["InvalidChannel"] = "InvalidChannel";
    BotError["InvalidChannelZone"] = "InvalidChannelZone";
    BotError["InvalidServerGroup"] = "InvalidServerGroup";
    BotError["InvalidClient"] = "InvalidClient";
    BotError["ChannelNameExists"] = "ChannelNameExists";
    BotError["CannotDeleteOnlyOneSubchannel"] = "CannotDeleteOnlyOneSubchannel";
})(BotError = exports.BotError || (exports.BotError = {}));
exports.genericBotError = () => ({
    type: BotError.GenericBotError,
    reason: 'An unexpected error has ocurred',
});
exports.notConnectedError = () => ({
    type: BotError.NotConnected,
    reason: 'The bot has lost server connection',
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
exports.channelNameExistsError = (name) => ({
    type: BotError.ChannelNameExists,
    reason: `A channel with this name (${name}) already exists at the same depth`,
});
exports.onlyOneSubchannelError = () => ({
    type: BotError.CannotDeleteOnlyOneSubchannel,
    reason: 'Can not delete channel since there is only one subchannel',
});
//# sourceMappingURL=Error.js.map