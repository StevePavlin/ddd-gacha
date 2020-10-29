import {IDomainEvent} from "./DomainEvent";
import {Entity} from "./Entity";

export class AggregateRoot extends Entity {
    private events: IDomainEvent[]

    constructor(id?: number) {
        super(id);
    }

    protected addDomainEvent(event: IDomainEvent) {
        this.events.push(event);
    }
}