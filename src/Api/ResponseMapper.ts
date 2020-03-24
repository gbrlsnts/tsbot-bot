import { ValidationError } from "@hapi/joi";
import { Response as ExpressResponse } from "express";
import { Either } from "../Lib/Either";
import { Failure } from "../Lib/Failure";
import { Response } from "./Response";
import Logger from "../Log/Logger";

export class ResponseMapper {
    constructor(private readonly logger: Logger)
    {

    }

    /**
     * Map a response from a domain result
     * @param response The express response
     * @param domainResult The domain result
     */
    fromDomain(response: ExpressResponse, domainResult: Either<Failure<any>, any>): Response
    {
        const res = new Response(response);

        if(domainResult.isLeft()) {
            return res
                .status(422)
                .error(domainResult.value.type, domainResult.value.reason);
        }

        return res.data(domainResult.value);
    }

    /**
     * Map a response from an exception
     * @param response The express response
     * @param domainResult The domain result
     */
    fromException(response: ExpressResponse, exception: any): Response
    {
        if(!(exception instanceof Error)) {
            return new Response(response)
                .status(500)
                .error('Unknown error', 'Unknown error');            
        }

        if(this.isValidationException(exception)) {
            return new Response(response)
                .status(422)
                .addErrors(exception.details.map(error => {
                    return {
                        title: 'Field failed validation: ' + error.type,
                        detail: error.message,
                        source: {
                            pointer: error.context?.label || '',
                        }
                    };
                }));
        }

        this.logger.error('Api exception', {
            error: exception
        });

        return new Response(response)
            .status(500)
            .error(exception.name, exception.message);
    }

    /**
     * Check if the exception is from validations
     * @param exception Exception to check
     */
    private isValidationException(exception: Error): exception is ValidationError
    {
        return 'isJoi' in exception;
    }
}