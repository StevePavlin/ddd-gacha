import {QueryTypes, Transaction} from "sequelize";
import {sequelize} from "./connection";
import {IDbContext, ITransactionalRepo, IUnitOfWork, TransactionIsolationLevel} from "../interfaces";

const promiseRetry = require('promise-retry');


export class SequelizeDbContext implements IDbContext {
    private transactionalRepos: ITransactionalRepo[] = [];


    protected registerTransactionalRepo<T extends ITransactionalRepo>(repo: T) {
        this.transactionalRepos.push(repo);
    }


    // Transaction retry logic, retry 10 times with a backoff jitter if we get a locking error
    private async retryTransactionUntilSuccess(operation: Function) {
        await promiseRetry(async (retry: Function) => {
            try {
                await operation();
            } catch (err) {
                // Postgres serialization failure, we can safely retry the transaction
                if (err.original && parseInt(err.original.code) === 40001) {
                    return retry({
                        message: 'Serialization failure.'
                    });
                }

                // Unidentified error when running the operation, we cannot recover from it
                console.error(`Unidentified database error`, err);
                throw err;
            }
        }, {
            retries: 10,
            minTimeout: 2,
            randomize: true
        })
    }


    async beginTransaction(
        isolationLevel: TransactionIsolationLevel,
        operation: (unitOfWork?: IUnitOfWork) => void,
        autoCommit: boolean = true
    ): Promise<void> {


        let sequelizeIsolationLevel: Transaction.ISOLATION_LEVELS;
        switch (isolationLevel) {
            case TransactionIsolationLevel.READ_COMMITTED:
                sequelizeIsolationLevel = Transaction.ISOLATION_LEVELS.READ_COMMITTED;
                break;

            case TransactionIsolationLevel.REPEATABLE_READ:
                sequelizeIsolationLevel = Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
                break;

            case TransactionIsolationLevel.SERIALIZABLE:
                sequelizeIsolationLevel = Transaction.ISOLATION_LEVELS.SERIALIZABLE;
                break;
        }

        let unitOfWork: IUnitOfWork;
        try {
            await this.retryTransactionUntilSuccess(async () => {
                // Open a new database tx
                unitOfWork = await sequelize.transaction({
                    isolationLevel: sequelizeIsolationLevel
                });

                // Tell all interested repositories to use this unit of work in their operations
                this.transactionalRepos.forEach(
                    repo => repo.provideUnitOfWork(unitOfWork)
                );

                if (autoCommit) {
                    await operation();
                    await unitOfWork.commit();
                } else {
                    // Let the client code take care of the commit/rollback
                    await operation(unitOfWork);
                }
            });
        } catch(err) {
            // This branch is reached after we've exhausted our attempts, or an identified error occurred
            // Give up and let the client code handle the error

            // @ts-ignore
            await unitOfWork.rollback();
            throw err;
        }
    }

    async rawSelect(query: string, replacements: any): Promise<object[]> {
        return await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });
    }
}

