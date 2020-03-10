export interface Route {
    /**
     * Register the route
     */
    register(): this;

    /**
     * Set a prefix for the route url
     * @param prefix Prefix for this route
     */
    setPrefix(prefix: string): this;
}