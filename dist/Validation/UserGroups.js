"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
exports.setUserGroupsBase = {
    clientDatabaseId: joi_1.default.number().required().min(1),
    groups: joi_1.default.array()
        .required()
        .unique()
        .items(joi_1.default.number().integer().positive()),
};
exports.setUserGroupsCommand = {
    ...exports.setUserGroupsBase,
    allowed: joi_1.default.array()
        .optional()
        .unique()
        .min(1)
        .items(joi_1.default.number().integer().positive()),
};
//# sourceMappingURL=UserGroups.js.map