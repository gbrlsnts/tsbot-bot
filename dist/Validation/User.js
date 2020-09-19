"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
exports.verifyUser = joi_1.default.object({
    template: joi_1.default.string()
        .required()
        .min(1)
        .max(8000)
        .pattern(/.*\{%TOKEN%\}.*/, 'required {%TOKEN%}'),
    targets: joi_1.default.array()
        .required()
        .min(1)
        .unique('clientId')
        .unique('token')
        .items(joi_1.default.object().keys({
        clientId: joi_1.default.number().required().min(1),
        token: joi_1.default.string().required().min(1).max(40),
    })),
});
//# sourceMappingURL=User.js.map