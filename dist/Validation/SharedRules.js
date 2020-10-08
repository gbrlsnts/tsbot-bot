"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../Commands/Subscribers/Getters/Types");
const Joi = require("@hapi/joi");
exports.zoneRules = {
    id: Joi.number().integer().positive().required(),
    start: Joi.number().integer().positive().required(),
    end: Joi.number().integer().positive().required(),
    separators: Joi.boolean().required(),
};
exports.zone = {
    zone: Joi.object().keys({
        start: exports.zoneRules.start,
        end: exports.zoneRules.end,
        separators: exports.zoneRules.separators,
    }),
};
exports.channelId = {
    channelId: Joi.number().required().integer().positive(),
};
exports.optRootChannelId = {
    rootChannelId: Joi.number().optional().integer().positive(),
};
exports.channelNames = {
    channels: Joi.array().required().min(1).items(Joi.string()),
    ...exports.optRootChannelId,
};
exports.iconIds = Joi.array()
    .required()
    .unique()
    .min(1)
    .items(Joi.number().integer().not(0, 100, 200, 300, 400, 500, 600));
exports.clientIpAddress = Joi.string()
    .required()
    .ip({
    cidr: 'forbidden',
    version: ['ipv4', 'ipv6'],
});
exports.tsGroupType = Joi.string()
    .required()
    .valid(...Object.values(Types_1.TsGroupType));
//# sourceMappingURL=SharedRules.js.map