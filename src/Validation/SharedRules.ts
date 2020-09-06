import Joi = require('@hapi/joi');

export const zone = {
    zone: Joi.object().keys({
        start: Joi.number().integer().positive().required(),
        end: Joi.number().integer().positive().required(),
        separators: Joi.boolean().required(),
    }),
};

export const channelId = {
    channelId: Joi.number().required().integer().positive(),
};

export const optRootChannelId = {
    rootChannelId: Joi.number().optional().integer().positive(),
};

export const channelNames = {
    channels: Joi.array().required().min(1).items(Joi.string()),
    ...optRootChannelId,
};

export const iconIds = Joi.array()
    .required()
    .min(1)
    .items(Joi.number().integer().positive());
