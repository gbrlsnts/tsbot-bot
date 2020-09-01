"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
const Types_1 = require("../../Bot/Types");
exports.zone = {
    zone: Joi.object().keys({
        start: Joi.number().min(1).required(),
        end: Joi.number().min(1).required(),
        separators: Joi.boolean().required(),
    }),
};
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
    ...exports.zone,
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
exports.channelId = {
    channelId: Joi.number().required().min(1),
};
exports.createSubChannel = {
    ...exports.createChannel,
    ...exports.channelId,
};
exports.deleteChannel = {
    ...exports.zone,
    ...exports.channelId,
    rootChannelId: Joi.number().optional().min(1),
};
//# sourceMappingURL=UserChannelValidationRules.js.map