import {
    IGachaDbContext
} from "../../infra/database/interfaces";
import {TransactionIsolationLevel} from "../../../../shared/infra/database/interfaces";

export class AddItemToBackpack {

    constructor(private gachaContext: IGachaDbContext) {}

    async execute(playerId: number, itemName: string, quantity: number): Promise<void> {
        console.log(`Adding item ${itemName} to player ${playerId}s backpack`)

        await this.gachaContext.beginTransaction(TransactionIsolationLevel.SERIALIZABLE, async() => {
            const player = await this.gachaContext.playerRepo.findById(playerId);
            const item = await this.gachaContext.itemRepo.findByName(itemName);

            player.getBackpack().addItem(item, quantity);

            await this.gachaContext.playerRepo.save(player);
        });
    }
}