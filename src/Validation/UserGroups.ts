import Joi from '@hapi/joi';

export const setUserGroupsBase = {
    clientDatabaseId: Joi.number().required().min(1),
    groups: Joi.array()
        .required()
        .unique()
        .items(Joi.number().integer().positive()),
};

export const setUserGroupsCommand = {
    ...setUserGroupsBase,
    allowed: Joi.array()
        .optional()
        .unique()
        .min(1)
        .items(Joi.number().integer().positive()),
};
