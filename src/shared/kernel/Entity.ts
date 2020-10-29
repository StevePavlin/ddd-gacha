export class Entity {

    constructor(private id?: number) {}

    getId() {
        return this.id;
    }

    equals(other: Entity) {
        return (
            JSON.stringify(Object.values(this)) === JSON.stringify(Object.values(other))
            && JSON.stringify(Object.keys(this)) === JSON.stringify(Object.keys(other))
        ) || this.id === other.getId()
    }
}