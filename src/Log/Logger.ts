import pino from "pino";
import e from "express";

export default class Logger {
    readonly logger: pino.Logger;

    constructor({ level, existing }: { level?: Level; existing?: pino.Logger; } = {})
    {
        this.logger = existing || pino();
        
        if(level)
            this.logger.level = level;
    }

    scoped(context: Context, level?: string): Logger
    {
        const child = this.logger.child({
            level,
            context
        });

        return new Logger({ existing: child });
    }

    trace(message: string, opts: ErrorLogOptions): void
    {
        this.logger.trace(this.getContextObject(opts), message);
    }

    debug(message: string, opts?: LogOptions): void
    {
        this.logger.debug(this.getContextObject(opts), message);
    }

    info(message: string, opts?: LogOptions): void
    {
        this.logger.info(this.getContextObject(opts), message);
    }

    warn(message: string, opts?: LogOptions): void
    {
        this.logger.warn(this.getContextObject(opts), message);
    }

    error(message: string, opts: ErrorLogOptions): void
    {
        this.logger.error(this.getContextObject(opts), message);
    }

    fatal(message: string, opts: ErrorLogOptions): void
    {
        this.logger.fatal(this.getContextObject(opts), message);
    }

    private getContextObject(opts?: LogOptions | ErrorLogOptions): Object
    {
        const context: { [key: string]: any } = { ...opts?.context };

        if(opts?.canShare)
            context.canShare = true;

        if(opts && this.isErrorLog(opts)) {
            if(this.isException(opts.error)) {
                context.error = { msg: opts.error.message, name: opts.error.name, stack: opts.error.stack };
            } else {
                context.error = opts.error;
            }
        }

        return context;
    }

    private isErrorLog(object: Object): object is ErrorLogOptions {
        return 'error' in object;
    }

    private isException(object: Object): object is Error {
        return 'stack' in object;
    }
}

export type Level = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface Context
{
    /** Context properties */
    [key: string]: any,
}

export interface LogOptions
{
    /** the log context */
    context?: Context
    /** If the log should be shared with the server owner. default: false */
    canShare?: boolean;
}

export interface ErrorLogOptions extends LogOptions
{
    /** The error to log */
    error?: any
}