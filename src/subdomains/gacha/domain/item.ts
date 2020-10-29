import {AggregateRoot} from "../../../shared/kernel/AggregateRoot";
import {Player} from "./player";


export class Item extends AggregateRoot {

    constructor(
        private name: string,
        id?: number
    ) {
        super(id);
    }

    getName() {
        return this.name;
    }
}