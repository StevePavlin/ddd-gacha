export class ValueObject {

    equals(other: ValueObject) {
        return JSON.stringify(Object.values(this)) === JSON.stringify(Object.values(other))
        && JSON.stringify(Object.keys(this)) === JSON.stringify(Object.keys(other))
    }
}