import {Backpack} from "./backpack";
import {AggregateRoot} from "../../../shared/kernel/AggregateRoot";


export class Player extends AggregateRoot {

    constructor(
        private name: string,
        private backpack: Backpack = new Backpack([]),
        id?: number
    ) {
        super(id);
    }

    getName() {
        return this.name;
    }

    getBackpack() {
        return this.backpack;
    }
}