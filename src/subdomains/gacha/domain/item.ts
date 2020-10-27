export class Item {

    constructor(
        private name: string,
        private id?: number
    ) {}

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }
}