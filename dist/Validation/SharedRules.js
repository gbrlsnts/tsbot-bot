"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
exports.zone = {
    zone: Joi.object().keys({
        start: Joi.number().integer().positive().required(),
        end: Joi.number().integer().positive().required(),
        separators: Joi.boolean().required(),
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
    .min(1)
    .items(Joi.number().integer().positive());
//# sourceMappingURL=SharedRules.js.map