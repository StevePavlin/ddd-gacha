import {Player} from "./player";
import {Item} from "./item";
import { assert, expect } from "chai";

describe('Backpack unit tests', () => {

    describe('Moving an item', () => {
        let amber: Player,
            healthPotion: Item,
            manaPotion: Item;
        beforeEach(() => {
            healthPotion = new Item('Health Potion', 1);
            manaPotion = new Item('Mana Potion', 2);

            amber = new Player('Amber');

            amber.getBackpack().addItem(healthPotion, 1);
            amber.getBackpack().addItem(manaPotion, 1);
        })

        const inspectBackpack = (papayaFruitPosition: number, keybladePosition: number) => {
            const firstItem = amber.getBackpack().getSlots()[0];
            const secondItem = amber.getBackpack().getSlots()[1];

            expect(firstItem.getItem().getId()).to.equal(healthPotion.getId());
            expect(firstItem.getPosition()).to.equal(papayaFruitPosition);

            expect(secondItem.getItem().getId()).to.equal(manaPotion.getId());
            expect(secondItem.getPosition()).to.equal(keybladePosition);
        }

        it('should throw an exception if an item does not exist in the backpack', () => {
            const charm = new Item('Charm', 3);

            assert.throws(() => {
                amber.getBackpack().moveItem(charm, 2)
            }, 'Item Charm does not exist in the backpack')
        });
        it('should swap the positions of items when the destination position already holds an item', () => {
            // Inspect the beginning state of the backpack
            inspectBackpack(1, 2);

            // Move papaya fruit to position 2, this should swap the positions
            amber.getBackpack().moveItem(healthPotion, 2);

            // Re-inspect the state of the backpack
            inspectBackpack(2, 1);
        })
        it('should move an item without touching existing items when the destination position does not hold an item', () => {
            // Inspect the beginning state of the backpack
            inspectBackpack(1, 2);

            // Move papaya fruit to position 3, this should not swap the positions
            amber.getBackpack().moveItem(healthPotion, 3);

            // Re-inspect the state of the backpack
            inspectBackpack(3, 2);
        })
    })
})