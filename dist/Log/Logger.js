"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
class Logger {
    constructor({ level, existing } = {}) {
        this.logger = existing || pino_1.default();
        if (level)
            this.logger.level = level;
    }
    scoped(context, level) {
        const child = this.logger.child({
            level,
            context
        });
        return new Logger({ existing: child });
    }
    trace(message, opts) {
        this.logger.trace(this.getContextObject(opts), message);
    }
    debug(message, opts) {
        this.logger.debug(this.getContextObject(opts), message);
    }
    info(message, opts) {
        this.logger.info(this.getContextObject(opts), message);
    }
    warn(message, opts) {
        this.logger.warn(this.getContextObject(opts), message);
    }
    error(message, opts) {
        this.logger.error(this.getContextObject(opts), message);
    }
    fatal(message, opts) {
        this.logger.fatal(this.getContextObject(opts), message);
    }
    getContextObject(opts) {
        var _a, _b;
        const context = { ...(_a = opts) === null || _a === void 0 ? void 0 : _a.context };
        if ((_b = opts) === null || _b === void 0 ? void 0 : _b.canShare)
            context.canShare = true;
        if (opts && this.isErrorLog(opts)) {
            if (this.isException(opts.error)) {
                context.error = { msg: opts.error.message, name: opts.error.name, stack: opts.error.stack };
            }
            else {
                context.error = opts.error;
            }
        }
        return context;
    }
    isErrorLog(object) {
        return 'error' in object;
    }
    isException(object) {
        return 'stack' in object;
    }
}
exports.default = Logger;
//# sourceMappingURL=Logger.js.map