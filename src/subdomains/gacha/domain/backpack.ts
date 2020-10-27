import {Item} from "./item";
import {Player} from "./player";
import {BackpackSlot} from "./backpack-slot";

export class Backpack {

    constructor(private slots: BackpackSlot[]) {}


    private getNextFreePosition() {
        // non-zero based indexes just for fun
        return this.slots.length + 1;
    }


    getSlots() {
        return this.slots;
    }


    addItem(item: Item, quantity: number) {
        const index = this.slots.findIndex(
            slot => slot.getItem().getId() === item.getId()
        );

        if (index > -1) {
            this.slots[index].increaseQuantity(quantity);
        } else {
            this.slots.push(
                new BackpackSlot(item, quantity, this.getNextFreePosition())
            );
        }
    }

    moveItem(item: Item, destinationPosition: number) {
        // Get the item we want to move
        const originSlot = this.slots.find(
            slot => slot.getItem().getId() === item.getId()
        );

        if (!originSlot) {
            throw new Error(`Item ${item.getName()} does not exist in the backpack`)
        }

        // If we're already in the correct position, we're good
        if (destinationPosition === originSlot.getPosition()) {
            return;
        }

        // Get the item at the position we want to move to
        const destinationSlot = this.slots.find(
            slot => slot.getPosition() === destinationPosition
        );

        // If there's an item occupying the destination slot, we need to make a swap
        if (!!destinationSlot) {
            // Make a copy of the origin position [ [1] 2 . ]
            const originalOriginalSlotPosition = originSlot.getPosition();

            // Move the item in the destination slot the the next available slot [ 1 . [2] ]
            destinationSlot.setPosition(
                this.getNextFreePosition()
            );

            // Move the origin item to the destination position [ . [1] 2 ]
            originSlot.setPosition(destinationPosition);

            // Move the item that we temporarily moved to the origin position [ 2 [1] . ]
            destinationSlot.setPosition(originalOriginalSlotPosition);
        } else {
            // Nothing in the destination position
            // Move the origin item to the destination position [ . 2 [1] ]
            originSlot.setPosition(destinationPosition);
        }
    }
}