import {RegisterPlayer} from "./register-player";
import {GetPlayerByName} from "../queries/get-player-by-name";
import {CreateItem} from "./create-item";
import {AddItemToBackpack} from "./add-item-to-backpack";
import {Player} from "../../domain/player";
import { expect } from "chai";
import {Item} from "../../domain/item";
import {GetItemByName} from "../queries/get-item-by-name";
import {container} from "../../infra/ioc/container";
import {MoveBackpackItem} from "./move-backpack-item";
import {IGachaDbContext} from "../../infra/database/interfaces";

describe('MoveBackpackItem command', () => {

    let amber: Player,

        healthPotion: Item,
        manaPotion: Item,

        // Resolve setup dependencies (they don't need a fresh db context injected)
        registerPlayer = container.resolve<RegisterPlayer>('registerPlayer'),
        createItem = container.resolve<CreateItem>('createItem'),
        addItemToBackpack = container.resolve<AddItemToBackpack>('addItemToBackpack'),

        getPlayerByName = container.resolve<GetPlayerByName>('getPlayerByName'),
        getItemByName = container.resolve<GetItemByName>('getItemByName'),

        gachaContext = container.resolve<IGachaDbContext>('gachaContext');


    beforeEach(async() => {
        // Register a player
        await registerPlayer.execute('Amber')
        amber = await getPlayerByName.execute('Amber');


        // Create some items
        await createItem.execute('Health Potion');
        healthPotion = await getItemByName.execute('Health Potion');

        await createItem.execute('Mana Potion');
        manaPotion = await getItemByName.execute('Mana Potion')


        // Add to backpack
        await addItemToBackpack.execute(
            <number>amber.getId(), 'Health Potion', 5
        )
        await addItemToBackpack.execute(
            <number>amber.getId(), 'Mana Potion', 5
        )
    })

    it('should be an idempotent operation', async() => {
        await Promise.all(
            [...new Array(10)].map(
                async _ => {
                    await container.resolve<MoveBackpackItem>('moveBackpackItem').execute(
                        <number>amber.getId(), 'Health Potion', 2
                    )
                }
            ),
        );


        // Query directly, avoiding extra repository complexity exclusively for tests
        const rows = await gachaContext.rawSelect(
            `select * from backpack_slots where player_id = :player_id`, {
                player_id: amber.getId()
            }
        );

        // There should be 2 rows in the database
        expect(rows.length).to.equal(2);


        const getRowWithPosition = (position: number) => {
            return rows.find(
                (row: any) => row.position === position
            )
        }

        const inspectRow = (row: any, position: number, item_id: number) => {
            expect(row.player_id).to.equal(amber.getId());
            expect(row.item_id).to.equal(item_id);
            expect(row.quantity).to.equal(5);
            expect(row.position).to.equal(position);
        }

        const position1Row = getRowWithPosition(1);
        const position2Row = getRowWithPosition(2);

        inspectRow(position1Row, 1, <number>manaPotion.getId());
        inspectRow(position2Row, 2, <number>healthPotion.getId());
    })
})