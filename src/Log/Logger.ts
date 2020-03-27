import pino from "pino";

export default class Logger {
    readonly logger: pino.Logger;

    constructor({ level, existing }: { level?: Level; existing?: pino.Logger; } = {})
    {
        this.logger = existing || pino();
        
        if(level)
            this.logger.level = level;
    }

    scoped(merge: Log, level?: string): Logger
    {
        const child = this.logger.child({
            level,
            ...merge
        });

        return new Logger({ existing: child });
    }

    trace(message: string, opts: ErrorLogOptions): void
    {
        this.logger.trace(this.getMergingObject(opts), message);
    }

    debug(message: string, opts?: LogOptions): void
    {
        this.logger.debug(this.getMergingObject(opts), message);
    }

    info(message: string, opts?: LogOptions): void
    {
        this.logger.info(this.getMergingObject(opts), message);
    }

    warn(message: string, opts?: LogOptions): void
    {
        this.logger.warn(this.getMergingObject(opts), message);
    }

    error(message: string, opts: ErrorLogOptions): void
    {
        this.logger.error(this.getMergingObject(opts), message);
    }

    fatal(message: string, opts: ErrorLogOptions): void
    {
        this.logger.fatal(this.getMergingObject(opts), message);
    }

    private getMergingObject(opts?: LogOptions | ErrorLogOptions): Object
    {
        const ctx: { [key: string]: any } = { context: { ...opts?.context } };

        if(opts?.canShare)
            ctx.canShare = true;

        if(opts && this.isErrorLog(opts)) {
            if(this.isException(opts.error)) {
                ctx.error = { msg: opts.error.message, name: opts.error.name, stack: opts.error.stack };
            } else {
                ctx.error = opts.error;
            }
        }

        return opts && Object.keys(ctx).length > 0 ? ctx : {};
    }

    private isErrorLog(object: Object): object is ErrorLogOptions {
        return 'error' in object;
    }

    private isException(object: Object): object is Error {
        return 'stack' in object;
    }
}

export type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface Log
{
    /** Context properties */
    [key: string]: any,
}

export interface LogOptions
{
    /** the log context */
    context?: Log
    /** If the log should be shared with the server owner. default: false */
    canShare?: boolean;
}

export interface ErrorLogOptions extends LogOptions
{
    /** The error to log */
    error?: any
}