import { resolve as pathResolve } from 'path';
import { LoaderInterface } from "./LoaderInterface";
import { LocalLoader } from "./LocalLoader";

export class Factory
{
    create(): LoaderInterface
    {
        return new LocalLoader(pathResolve('server_configs'));
    }
}