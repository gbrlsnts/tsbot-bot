import Joi = require("@hapi/joi");
import { BotCodec } from "../../../../../Bot/Types";

export const zone = {
    zone: Joi.object().keys({
        start: Joi.number().min(1).required(),
        end: Joi.number().min(1).required(),
        separators: Joi.boolean().required(),
    }),
};

export const channelProps = {
    permissions: Joi.array().items(Joi.object().keys({
        permission: Joi.string().required(),
        value: Joi.number().required().integer().min(0),
    })),
    properties: Joi.object().keys({
        audio: Joi.object().keys({
            codec: Joi.string().required().valid(...Object.values(BotCodec)),
            quality: Joi.number().required().integer().min(0).max(10),
        })
    }),

};

export const createChannel = {
    ...zone,
    owner: Joi.number().min(1),
    group: Joi.number().min(1),
    channels: Joi.array().required().items(Joi.object().keys({
        name: Joi.string().required().min(0).max(40),
        password: Joi.string().min(1),
        channels: Joi.link('...').required(), // reuse channels validation
        ...channelProps
    })),
    ...channelProps
};

export const channelId = {
    channelId: Joi.number().required().min(1),
}

export const createSubChannel = {
    ...createChannel,
    ...channelId,
};

export const deleteChannel = {
    ...zone,
    ...channelId,
};