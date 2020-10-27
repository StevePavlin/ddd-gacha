import {createContainer, InjectionMode, asClass, AwilixContainer} from "awilix";
import {AddItemToBackpack} from "../../app/commands/add-item-to-backpack";
import {CreateItem} from "../../app/commands/create-item";
import {MoveBackpackItem} from "../../app/commands/move-backpack-item";
import {RegisterPlayer} from "../../app/commands/register-player";
import {GetItemByName} from "../../app/queries/get-item-by-name";
import {GetPlayerByName} from "../../app/queries/get-player-by-name";
import {SequelizePlayerRepo} from "../database/sequelize/repos/sequelize-player-repo";
import {SequelizeItemRepo} from "../database/sequelize/repos/sequelize-item-repo";
import {SequelizeGachaDbContext} from "../database/sequelize/gacha-context";


const container: AwilixContainer = createContainer({ injectionMode: InjectionMode.CLASSIC });

// Repositories
container.register({
    playerRepo: asClass(SequelizePlayerRepo).transient(),
    itemRepo: asClass(SequelizeItemRepo).transient()
});

// Db context
container.register({
    gachaContext: asClass(SequelizeGachaDbContext).transient()
});

// Commands/queries
container.register({
    addItemToBackpack: asClass(AddItemToBackpack).transient(),
    createItem: asClass(CreateItem).transient(),
    moveBackpackItem: asClass(MoveBackpackItem).transient(),
    registerPlayer: asClass(RegisterPlayer).transient()
});
container.register({
    getItemByName: asClass(GetItemByName).transient(),
    getPlayerByName: asClass(GetPlayerByName).transient()
})



export { container }