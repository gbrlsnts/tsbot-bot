export interface Database {
    from(entity: string): this;
    getById(id: number | string): Record<number, object>;
}