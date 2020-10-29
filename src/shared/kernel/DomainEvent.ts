import {AggregateRoot} from "./AggregateRoot";

export interface IDomainEvent {
    createdAt: Date
    aggregateRoot: AggregateRoot
}