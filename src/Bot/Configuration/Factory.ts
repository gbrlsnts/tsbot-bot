import { resolve as pathResolve } from 'path';
import { LoaderInterface } from "./LoaderInterface";
import { LocalLoader } from "./LocalLoader";

export class Factory
{
    constructor(readonly opts: LoaderFactoryConfig)
    {

    }

    create(): LoaderInterface
    {
        return new LocalLoader(this.opts.configFolder);
    }
}

export interface LoaderFactoryConfig {
    /** Loader mode */
    mode: 'local';
    /** Server config path */
    configFolder: string;
}