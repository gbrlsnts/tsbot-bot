"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationError;
(function (ValidationError) {
    ValidationError["RequiredParameter"] = "RequiredParameter";
    ValidationError["InvalidType"] = "InvalidType";
    ValidationError["InvalidArgument"] = "InvalidArgument";
    ValidationError["InvalidBounds"] = "InvalidBounds";
    ValidationError["InvalidMinBound"] = "InvalidMinBound";
    ValidationError["InvalidMaxBound"] = "InvalidMaxBound";
})(ValidationError = exports.ValidationError || (exports.ValidationError = {}));
exports.requiredParameterError = (name) => ({
    type: ValidationError.RequiredParameter,
    reason: `The parameter '${name}' is required`,
});
exports.invalidTypeError = (prop, type) => ({
    type: ValidationError.InvalidType,
    reason: `'${prop}' requires type of '${type}'`,
});
exports.invalidArgumentError = (prop, accepted) => ({
    type: ValidationError.InvalidArgument,
    reason: `Invalid argument for '${prop}'. Accepted: ${accepted.join(',')}`,
});
exports.invalidBoundsError = (prop, min, max) => ({
    type: ValidationError.InvalidBounds,
    reason: `Out of bounds for '${prop}'. Accepted: Min ${min}; Max ${max}`,
});
exports.invalidMinBoundError = (prop, min) => ({
    type: ValidationError.InvalidMinBound,
    reason: `Out of minimum bound for '${prop}'. Accepted Min ${min}`,
});
exports.invalidMaxBoundError = (prop, max) => ({
    type: ValidationError.InvalidMaxBound,
    reason: `Out of maximum bound for '${prop}'. Accepted max ${max}`,
});
//# sourceMappingURL=ValidationError.js.map