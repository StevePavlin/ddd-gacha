import {Player} from "../../domain/player";
import {Item} from "../../domain/item";
import {IBaseRepo, IDbContext, ITransactionalRepo} from "../../../../shared/infra/database/interfaces";


export interface IPlayerRepo extends IBaseRepo<Player>, ITransactionalRepo {
    findByName(name: string): Promise<Player>
}
export interface IItemRepo extends IBaseRepo<Item>, ITransactionalRepo {
    findByName(name: string): Promise<Item>
}


export interface IGachaDbContext extends IDbContext {
    playerRepo: IPlayerRepo,
    itemRepo: IItemRepo
}