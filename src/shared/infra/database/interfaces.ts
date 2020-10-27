export interface IBaseRepo<T> {
    findById(id: number): Promise<T>

    save(entity: T): Promise<void>
}

export interface IUnitOfWork {
    commit(): void,
    rollback(): void
}

export interface ITransactionalRepo {
    provideUnitOfWork(unitOfWork: IUnitOfWork): void
}

export enum TransactionIsolationLevel {
    READ_COMMITTED,
    REPEATABLE_READ,
    SERIALIZABLE
}

export interface IDbContext {
    beginTransaction(
        isolationLevel: TransactionIsolationLevel,
        operation: (unitOfWork?: IUnitOfWork) => void,
        autoCommit?: boolean
    ): Promise<void>,

    rawSelect(query: string, replacements: any): Promise<object[]>
}

export interface IDbCleaner {
    setup(): void
    clean(): void
}