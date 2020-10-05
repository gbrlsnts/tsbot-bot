import Joi = require('@hapi/joi');

export const zoneRules = {
    id: Joi.number().integer().positive().required(),
    start: Joi.number().integer().positive().required(),
    end: Joi.number().integer().positive().required(),
    separators: Joi.boolean().required(),
};

export const zone = {
    zone: Joi.object().keys({
        start: zoneRules.start,
        end: zoneRules.end,
        separators: zoneRules.separators,
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
    .unique()
    .min(1)
    .items(Joi.number().integer().not(0, 100, 200, 300, 400, 500, 600));

export const clientIpAddress = Joi.string()
    .required()
    .ip({
        cidr: 'forbidden',
        version: ['ipv4', 'ipv6'],
    });
