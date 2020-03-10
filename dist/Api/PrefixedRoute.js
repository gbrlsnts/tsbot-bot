"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PrefixedRoute {
    constructor() {
        this._prefix = '/';
    }
    /**
     * Set a prefix for the route url
     * @param prefix Prefix for this route
     */
    setPrefix(prefix) {
        this.prefix = prefix;
        return this;
    }
    /**
     * Get a prefixed url
     * @param value The prefixed route
     */
    getWithPrefix(value) {
        const normalized = this.normalizeSegment(value);
        if (this.prefix === '/')
            return normalized;
        return this.prefix + normalized;
    }
    /**
     * Get the prefix value
     */
    get prefix() {
        return this._prefix;
    }
    ;
    /**
     * Set a prefix for the route url
     * @param value Prefix for this route
     */
    set prefix(value) {
        this._prefix = this.normalizeSegment(value);
    }
    /**
     * Normalize an url segment to the format '/segment'
     * @param value The segment to normalize
     */
    normalizeSegment(value) {
        return value.startsWith('/') ? value : '/' + value;
    }
}
exports.PrefixedRoute = PrefixedRoute;
//# sourceMappingURL=PrefixedRoute.js.map