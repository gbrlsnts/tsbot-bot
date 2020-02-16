import { Failure } from "../../Lib/Failure";
import { Either } from "../../Lib/Either";
import { BotError } from "../Error";

export interface ActionInterface<T> {
    /**
     * Execute the action
     */
    execute(): Promise<Either<Failure<BotError>, T>>;
}