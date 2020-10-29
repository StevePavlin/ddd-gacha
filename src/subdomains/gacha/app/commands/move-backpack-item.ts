import {
    IGachaDbContext
} from "../../infra/database/interfaces";

export class MoveBackpackItem {

    constructor(private gachaContext: IGachaDbContext) {}

    async execute(playerId: number, itemName: string, position: number): Promise<void> {
        const player = await this.gachaContext.playerRepo.findById(playerId);
        const item = await this.gachaContext.itemRepo.findByName(itemName);

        player.getBackpack().moveItem(item, position);

        await this.gachaContext.playerRepo.save(player);
    }
}