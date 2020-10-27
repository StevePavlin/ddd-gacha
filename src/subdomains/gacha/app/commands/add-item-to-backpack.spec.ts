import {RegisterPlayer} from "./register-player";
import {GetPlayerByName} from "../queries/get-player-by-name";
import {CreateItem} from "./create-item";
import {Player} from "../../domain/player";
import { expect } from "chai";
import {Item} from "../../domain/item";
import {GetItemByName} from "../queries/get-item-by-name";
import {container} from "../../infra/ioc/container";
import {AddItemToBackpack} from "./add-item-to-backpack";
import {IGachaDbContext} from "../../infra/database/interfaces";

describe('AddItemToBackpack application service', () => {

    let amber: Player,
        healthPotion: Item,

        // Resolve setup dependencies (they don't need a fresh db context injected)
        registerPlayer = container.resolve<RegisterPlayer>('registerPlayer'),
        createItem = container.resolve<CreateItem>('createItem'),

        getPlayerByName = container.resolve<GetPlayerByName>('getPlayerByName'),
        getItemByName = container.resolve<GetItemByName>('getItemByName'),


        gachaContext = container.resolve<IGachaDbContext>('gachaContext');


    beforeEach(async() => {
        // Register a player
        await registerPlayer.execute('Amber')
        amber = await getPlayerByName.execute('Amber');


        // Create a sword
        await createItem.execute('Health Potion');
        healthPotion = await getItemByName.execute('Health Potion');
    })

    it('should atomically create 75 items in a backpack', async() => {
        // Make 5 parallel requests to add 15 health potions (with a quantity of 5) to ambers inventory
        await Promise.all(
            [...new Array(15)].map(
                async _ => container.resolve<AddItemToBackpack>('addItemToBackpack').execute(
                    <number>amber.getId(), 'Health Potion', 5
                )
            )
        )

        // Query directly, avoiding extra repository complexity exclusively for tests
        const rows = await gachaContext.rawSelect(
            'select * from backpack_slots where player_id = :player_id', {
                player_id: amber.getId()
            }
        )

        // There should only be 1 row in the database, with a quantity of 25 (due to database locking)
        expect(rows.length).to.equal(1);

        const { quantity, position, player_id, item_id }: any = rows[0];

        // Inspect the state of the database row
        expect(quantity).to.equal(75);
        expect(position).to.equal(1);
        expect(player_id).to.equal(amber.getId());
        expect(item_id).to.equal(healthPotion.getId());
    })
})