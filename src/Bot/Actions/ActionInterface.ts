import { ActionResult } from "./ActionResult";

export interface ActionInterface {
    /**
     * Execute the action
     */
    execute(): Promise<ActionResult>;
}