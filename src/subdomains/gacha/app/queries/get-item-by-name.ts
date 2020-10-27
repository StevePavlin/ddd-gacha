import {IGachaDbContext, IItemRepo, IPlayerRepo} from "../../infra/database/interfaces";
import {Item} from "../../domain/item";


export class GetItemByName {

    constructor(private gachaContext: IGachaDbContext) {
    }

    async execute(name: string): Promise<Item> {
        return await this.gachaContext.itemRepo.findByName(name);
    }
}