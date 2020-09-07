export interface SetUserGroupsData {
    /** client database Id to set the groups */
    clientDatabaseId: number;
    /** server groups IDs to set */
    groups: number[];
    /** id of allowed groups. only used if trusted source is true */
    allowed?: number[];
    /** Set true if executing source is trustable. Disables server group ids validation. */
    trustedSource: boolean;
}
