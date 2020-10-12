import Joi from '@hapi/joi';

export const crawlerConfiguration = Joi.object({
    interval: Joi.number().required().min(30).max(14400),
    zones: Joi.array()
        .required()
        .items(
            Joi.object().keys({
                name: Joi.string().required().min(1),
                spacerAsSeparator: Joi.boolean().required(),
                start: Joi.number().required().min(1),
                end: Joi.number().required().min(1),
                inactiveIcon: Joi.number().min(1),
                timeInactiveNotify: Joi.number().required().min(1),
                timeInactiveMax: Joi.number()
                    .required()
                    .min(1)
                    .greater(Joi.ref('timeInactiveNotify')),
            })
        ),
});
