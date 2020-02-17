import { Response as ExpressResponse } from "express";
import { Response } from "./Response";
import { Either } from "../Lib/Either";
import { Failure } from "../Lib/Failure";
import { ResponseMapper } from "./ResponseMapper";

export abstract class ApiRoute {

    /**
     * Map a request result to a response
     * @param result The result to map
     */
    mapToResponse(response: ExpressResponse, result: Either<Failure<any>, any>): Response
    {
        return new ResponseMapper(response).fromDomain(result);
    }

    /**
     * Map a request exception to a response
     * @param result The exception to map
     */
    mapToExceptionResponse(response: ExpressResponse, exception: any): Response
    {
        return new ResponseMapper(response).fromException(exception);
    }
}