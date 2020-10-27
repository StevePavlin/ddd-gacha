import {Player} from "../../domain/player";
import {IGachaDbContext, IPlayerRepo} from "../../infra/database/interfaces";


export class RegisterPlayer {

    constructor(private gachaContext: IGachaDbContext) {}

    async execute(name: string): Promise<void> {
        const player = new Player(name);
        await this.gachaContext.playerRepo.save(player);
    }
}