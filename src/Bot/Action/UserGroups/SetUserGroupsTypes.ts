export interface SetUserGroupsData
{
    /** client database Id to set the groups */
    clientDatabaseId: number;
    /** server groups IDs to set */
    groups: number[];
}