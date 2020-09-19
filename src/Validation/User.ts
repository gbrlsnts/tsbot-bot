import Joi from '@hapi/joi';

export const verifyUser = Joi.object({
    template: Joi.string()
        .required()
        .min(1)
        .max(8000)
        .pattern(/.*\{%TOKEN%\}.*/, 'required {%TOKEN%}'),
    targets: Joi.array()
        .required()
        .min(1)
        .unique('clientId')
        .unique('token')
        .items(
            Joi.object().keys({
                clientId: Joi.number().required().min(1),
                token: Joi.string().required().min(1).max(40),
            })
        ),
});
