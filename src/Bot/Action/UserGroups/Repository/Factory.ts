import { LocalRepository } from "./LocalRepository";
import { resolve as pathResolve } from 'path';
import { RepositoryInterface } from "./RepositoryInterface";

export class Factory
{
    /**
     * Create the repository object
     */
    create(): RepositoryInterface
    {
        return new LocalRepository(pathResolve('database'));
    }
}