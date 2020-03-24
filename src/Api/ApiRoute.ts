import { Response as ExpressResponse } from "express";
import { Response } from "./Response";
import { Either } from "../Lib/Either";
import { Failure } from "../Lib/Failure";
import { ResponseMapper } from "./ResponseMapper";
import { PrefixedRoute } from "./PrefixedRoute";
import Logger from "../Log/Logger";

export abstract class ApiRoute extends PrefixedRoute {

    protected readonly mapper: ResponseMapper;

    constructor(logger: Logger)
    {
        super();

        this.mapper = new ResponseMapper(logger);
    }

    /**
     * Map a request result to a response
     * @param result The result to map
     */
    mapToResponse(response: ExpressResponse, result: Either<Failure<any>, any>): Response
    {
        return this.mapper.fromDomain(response, result);
    }

    /**
     * Map a request exception to a response
     * @param result The exception to map
     */
    mapToExceptionResponse(response: ExpressResponse, exception: any): Response
    {
        return this.mapper.fromException(response, exception);
    }
}