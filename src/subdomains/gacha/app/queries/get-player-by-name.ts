import {IGachaDbContext, IPlayerRepo} from "../../infra/database/interfaces";
import {Player} from "../../domain/player";


export class GetPlayerByName {

    constructor(private gachaContext: IGachaDbContext) {
    }

    async execute(name: string): Promise<Player> {
        return await this.gachaContext.playerRepo.findByName(name);
    }
}