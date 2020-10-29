import {Item} from "./item";
import {Entity} from "../../../shared/kernel/Entity";

export class BackpackSlot extends Entity {

    constructor(
        private item: Item,
        private quantity: number,
        private position: number,
        id?: number
    ) {
        super(id);
    }

    getItem() {
        return this.item;
    }

    getQuantity() {
        return this.quantity;
    }

    getPosition() {
        return this.position;
    }

    setPosition(position: number) {
        if (position <= 0) {
            throw new Error(`Invalid position (must be >= 1)`)
        }
        this.position = position;
    }

    increaseQuantity(amount: number) {
        this.quantity += amount;
    }
}