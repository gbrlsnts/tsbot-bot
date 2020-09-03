import Joi = require('@hapi/joi');
import { BotCodec } from '../../Bot/Types';
import { channelId, optRootChannelId, zone } from '../SharedRules';

export const channelProps = {
    permissions: Joi.array().items(
        Joi.object().keys({
            permission: Joi.string().required(),
            value: Joi.number().required().integer().min(0),
        })
    ),
    properties: Joi.object().keys({
        audio: Joi.object().keys({
            codec: Joi.string()
                .required()
                .valid(...Object.values(BotCodec)),
            quality: Joi.number().required().integer().min(0).max(10),
        }),
    }),
};

export const createChannel = {
    ...zone,
    owner: Joi.number().min(1),
    group: Joi.number().min(1),
    channels: Joi.array()
        .required()
        .items(
            Joi.object().keys({
                name: Joi.string().required().min(0).max(40),
                password: Joi.string().min(1),
                channels: Joi.link('...').required(), // reuse channels validation
                ...channelProps,
            })
        ),
    ...channelProps,
};

export const createSubChannel = {
    ...createChannel,
    ...optRootChannelId,
};

export const deleteChannel = {
    ...zone,
    ...channelId,
    ...optRootChannelId,
};
