import {Player} from "../../domain/player";
import {IGachaDbContext, IItemRepo, IPlayerRepo} from "../../infra/database/interfaces";
import {Item} from "../../domain/item";


export class CreateItem {

    constructor(private gachaContext: IGachaDbContext) {}

    async execute(name: string): Promise<void> {
        const item = new Item(name);
        await this.gachaContext.itemRepo.save(item);
    }
}