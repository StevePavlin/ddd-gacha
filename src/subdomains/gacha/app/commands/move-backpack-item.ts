import {
    IGachaDbContext
} from "../../infra/database/interfaces";
import {TransactionIsolationLevel} from "../../../../shared/infra/database/interfaces";

export class MoveBackpackItem {

    constructor(private gachaContext: IGachaDbContext) {}

    async execute(playerId: number, itemName: string, position: number): Promise<void> {
        console.log(`Moving item ${itemName} to position ${position} in players ${playerId}s backpack`)

        // Retrieve entities from storage
        const player = await this.gachaContext.playerRepo.findById(playerId);
        const item = await this.gachaContext.itemRepo.findByName(itemName);

        // Perform business operation
        player.getBackpack().moveItem(item, position);

        // Save/commit
        await this.gachaContext.playerRepo.save(player);

    }
}