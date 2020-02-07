import { LocalRepository } from "./LocalRepository";
import { resolve as pathResolve } from 'path';
import { RepositoryInterface } from "./RepositoryInterface";

export class Factory
{
    create(): RepositoryInterface
    {
        return new LocalRepository(pathResolve('database'));
    }
}