import Joi = require('@hapi/joi');

export const zone = {
    zone: Joi.object().keys({
        start: Joi.number().min(1).required(),
        end: Joi.number().min(1).required(),
        separators: Joi.boolean().required(),
    }),
};

export const channelId = {
    channelId: Joi.number().required().min(1),
};

export const rootChannelId = {
    rootChannelId: Joi.number().optional().min(1),
};
