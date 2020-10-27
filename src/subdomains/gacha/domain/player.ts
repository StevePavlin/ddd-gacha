import {Backpack} from "./backpack";


export class Player {

    constructor(
        private name: string,
        private backpack: Backpack = new Backpack([]),
        private id?: number
    ) {}

    getName() {
        return this.name;
    }

    getBackpack() {
        return this.backpack;
    }

    getId() {
        return this.id;
    }
}