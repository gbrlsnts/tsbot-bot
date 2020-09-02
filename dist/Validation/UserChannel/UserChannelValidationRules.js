"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const Types_1 = require("../../Bot/Types");
const SharedRules_1 = require("../SharedRules");
exports.channelProps = {
    permissions: Joi.array().items(Joi.object().keys({
        permission: Joi.string().required(),
        value: Joi.number().required().integer().min(0),
    })),
    properties: Joi.object().keys({
        audio: Joi.object().keys({
            codec: Joi.string()
                .required()
                .valid(...Object.values(Types_1.BotCodec)),
            quality: Joi.number().required().integer().min(0).max(10),
        }),
    }),
};
exports.createChannel = {
    ...SharedRules_1.zone,
    owner: Joi.number().min(1),
    group: Joi.number().min(1),
    channels: Joi.array()
        .required()
        .items(Joi.object().keys({
        name: Joi.string().required().min(0).max(40),
        password: Joi.string().min(1),
        channels: Joi.link('...').required(),
        ...exports.channelProps,
    })),
    ...exports.channelProps,
};
exports.createSubChannel = {
    ...exports.createChannel,
    ...SharedRules_1.rootChannelId,
};
exports.deleteChannel = {
    ...SharedRules_1.zone,
    ...SharedRules_1.channelId,
    ...SharedRules_1.rootChannelId,
};
//# sourceMappingURL=UserChannelValidationRules.js.map