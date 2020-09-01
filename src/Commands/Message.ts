export interface Message<T> {
    serverId: string | number;
    subject: string;
    data: T;
}
