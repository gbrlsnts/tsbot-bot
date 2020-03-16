export interface RepositoryInterface {
    /**
     * Get the allowed user groups
     */
    getUserGroups(): Promise<number[]>;
}