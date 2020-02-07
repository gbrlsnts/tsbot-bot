export interface EventHandlerInterface
{
    /**
     * Handle the event
     */
    handle(): Promise<void>;
}