import { Failure } from "../Lib/Failure";

export enum ValidationError {
    RequiredParameter = "RequiredParameter",
    InvalidType = "InvalidType",
    InvalidArgument = "InvalidArgument",
    InvalidBounds = "InvalidBounds",
    InvalidMinBound = "InvalidMinBound",
    InvalidMaxBound = "InvalidMaxBound",
}

export const requiredParameterError = (name: string): Failure<ValidationError.RequiredParameter> => ({
    type: ValidationError.RequiredParameter,
    reason: `The parameter '${name}' is required`,
});

export const invalidTypeError = (prop: string, type: string): Failure<ValidationError.InvalidType> => ({
    type: ValidationError.InvalidType,
    reason: `'${prop}' requires type of '${type}'`,
});

export const invalidArgumentError = (prop: string, accepted: string[]): Failure<ValidationError.InvalidArgument> => ({
    type: ValidationError.InvalidArgument,
    reason: `Invalid argument for '${prop}'. Accepted: ${accepted.join(',')}`,
});

export const invalidBoundsError = (prop: string, min: number, max: number): Failure<ValidationError.InvalidBounds> => ({
    type: ValidationError.InvalidBounds,
    reason: `Out of bounds for '${prop}'. Accepted: Min ${min}; Max ${max}`,
});

export const invalidMinBoundError = (prop: string, min: number): Failure<ValidationError.InvalidMinBound> => ({
    type: ValidationError.InvalidMinBound,
    reason: `Out of minimum bound for '${prop}'. Accepted Min ${min}`,
});

export const invalidMaxBoundError = (prop: string, max: number): Failure<ValidationError.InvalidMaxBound> => ({
    type: ValidationError.InvalidMaxBound,
    reason: `Out of maximum bound for '${prop}'. Accepted max ${max}`,
});