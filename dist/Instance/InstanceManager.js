"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InstanceManager {
    constructor(factory, gateways) {
        this.factory = factory;
        this.gateways = gateways;
        this.instances = new Map();
    }
    /**
     * Get all instances
     */
    getInstances() {
        return Array.from(this.instances.values());
    }
    /**
     * Check if a server id instance exists
     * @param serverId
     */
    hasInstance(serverId) {
        return this.instances.has(serverId);
    }
    /**
     * Get an instance of a server id
     * @param serverId
     */
    getInstance(serverId) {
        return this.instances.get(serverId);
    }
    /**
     *
     * @param id numeric id or server name of the instance to load.
     *      server name should be used when using local configs
     */
    async loadInstance(id) {
        const manager = await this.factory.create(id.toString());
        this.instances.set(manager.bot.serverId, manager);
        return manager;
    }
    /**
     * Remove an instance of a server id
     * @param serverId
     */
    removeInstance(serverId) {
        this.instances.delete(serverId);
    }
}
exports.InstanceManager = InstanceManager;
//# sourceMappingURL=InstanceManager.js.map