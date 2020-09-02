"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("@hapi/joi");
exports.zone = {
    zone: Joi.object().keys({
        start: Joi.number().min(1).required(),
        end: Joi.number().min(1).required(),
        separators: Joi.boolean().required(),
    }),
};
exports.channelId = {
    channelId: Joi.number().required().min(1),
};
exports.rootChannelId = {
    rootChannelId: Joi.number().optional().min(1),
};
//# sourceMappingURL=SharedRules.js.map