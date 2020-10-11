export const getAllCrawlsSubject = (serverId: number | string) =>
    `backend.server.${serverId}.crawl.get-all`;
export const getPrevCrawlSubject = (serverId: number | string) =>
    `backend.server.${serverId}.crawl.get-prev`;
export const getAddCrawlSubject = (serverId: number | string) =>
    `backend.server.${serverId}.crawl.add`;
export const getAllInactiveChannelsSubject = (serverId: number | string) =>
    `backend.server.${serverId}.inactive-channels.get-all`;
export const getSetInactiveChannelsSubject = (serverId: number | string) =>
    `backend.server.${serverId}.inactive-channels.set`;
export const getFindInactiveChannelByIdSubject = (serverId: number | string) =>
    `backend.server.${serverId}.inactive-channels.get-by-id`;
export const getSetInactiveChannelNotifiedSubject = (
    serverId: number | string
) => `backend.server.${serverId}.inactive-channels.set-notified`;
