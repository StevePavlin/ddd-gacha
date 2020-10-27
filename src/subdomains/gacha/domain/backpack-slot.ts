import {Item} from "./item";
import {Player} from "./player";

export class BackpackSlot {

    constructor(
        private item: Item,
        private quantity: number,
        private position: number,
        private id?: number
    ) {}

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

    getId() {
        return this.id;
    }

    increaseQuantity(amount: number) {
        this.quantity += amount;
    }
}