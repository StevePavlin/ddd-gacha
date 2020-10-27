import {IGachaDbContext, IItemRepo, IPlayerRepo} from "../interfaces";
import {SequelizeDbContext} from "../../../../../shared/infra/database/sequelize/db-context";

export class SequelizeGachaDbContext extends SequelizeDbContext implements IGachaDbContext {
    constructor(
        public playerRepo: IPlayerRepo,
        public itemRepo: IItemRepo
    ) {
        super();
        super.registerTransactionalRepo<IPlayerRepo>(playerRepo);
        super.registerTransactionalRepo<IItemRepo>(itemRepo);
    }
}