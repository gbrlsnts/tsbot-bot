import { ValidationOptions } from "@hapi/joi"
import Joi = require("@hapi/joi");

export default class Validator {
    
    private readonly defaultValidationOptions: ValidationOptions = {
        abortEarly: false,
    };

    /**
     * Create an object insteace of a validator
     * @param schema Schema for this validator
     */
    constructor(private readonly schema: Joi.ObjectSchema)
    {

    }

    /**
     * Validate request data
     * @param data Data to validate
     * @param validationOptions Options for the validation. Will override default options
     */
    async validate(data: any, validationOptions?: ValidationOptions): Promise<any>
    {
        return await this.schema
            .validateAsync(data, validationOptions || this.defaultValidationOptions);
    }
}