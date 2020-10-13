import Factory from '../Bot/Factory';
import Manager from '../Bot/Manager';

export class InstanceManager {
    private readonly instances: Map<number, Manager>;

    constructor(private readonly factory: Factory) {
        this.instances = new Map();
    }

    /**
     * Get all instances
     */
    getInstances(): Manager[] {
        return Array.from(this.instances.values());
    }

    /**
     * Check if a server id instance exists
     * @param serverId
     */
    hasInstance(serverId: number): boolean {
        return this.instances.has(serverId);
    }

    /**
     * Get an instance of a server id
     * @param serverId
     */
    getInstance(serverId: number): Manager | undefined {
        return this.instances.get(serverId);
    }

    /**
     * @param id numeric id or server name of the instances to load.
     *      server name should be used when using local configs
     */
    async loadInstances(
        ids: string[] | number[]
    ): Promise<LoadInstancesResult> {
        const promises = [];

        for (const instance of ids) {
            promises.push(this.loadInstance(instance));
        }

        const result = await Promise.allSettled(promises);

        const sucessCount = result
            .map(r => (r.status === 'fulfilled' ? 1 : (0 as number)))
            .reduce((acc, curr) => acc + curr, 0);

        return {
            success: sucessCount,
            fail: promises.length - sucessCount,
            result: result.map(r => ({
                value: r.status === 'fulfilled' ? r.value : undefined,
                error: r.status === 'rejected' ? r.reason : undefined,
            })),
        };
    }

    /**
     * @param id numeric id or server name of the instance to load.
     *      server name should be used when using local configs
     */
    async loadInstance(id: string | number): Promise<Manager> {
        const manager = await this.factory.create(id.toString());

        this.instances.set(manager.bot.serverId, manager);

        return manager;
    }

    /**
     * Remove an instance of a server id
     * @param serverId
     */
    removeInstance(serverId: number): void {
        this.instances.delete(serverId);
    }
}

export interface LoadInstancesResult {
    success: number;
    fail: number;
    result: { value?: Manager; error?: any }[];
}
