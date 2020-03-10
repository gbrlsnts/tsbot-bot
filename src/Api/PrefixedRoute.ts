export abstract class PrefixedRoute {

    _prefix: string = '/';

    /**
     * Set a prefix for the route url
     * @param prefix Prefix for this route
     */
    setPrefix(prefix: string): this
    {
        this.prefix = prefix;

        return this;
    }

    /**
     * Get a prefixed url
     * @param value The prefixed route
     */
    getWithPrefix(value: string)
    {
        const normalized = this.normalizeSegment(value);

        if(this.prefix === '/')
            return normalized;

        return this.prefix + normalized;
    }

    /**
     * Get the prefix value
     */
    get prefix(): string
    {
        return this._prefix;
    };

    /**
     * Set a prefix for the route url
     * @param value Prefix for this route
     */
    set prefix(value: string)
    {
        this._prefix = this.normalizeSegment(value);
    }

    /**
     * Normalize an url segment to the format '/segment'
     * @param value The segment to normalize
     */
    protected normalizeSegment(value: string)
    {
        return value.startsWith('/') ? value : '/' + value;
    }
}