import {Guard} from "../../../shared/kernel/Guard";
import {ValueObject} from "../../../shared/kernel/ValueObject";
import {Item} from "./item";
import {Operation} from "../../../shared/kernel/Operation";
import {Entity} from "../../../shared/kernel/Entity";
import {Banner} from "./banner";


export class BannerItem extends Entity {

    private constructor(
        private item: Item,
        private baseWinChance: number,
        id?: number
    ) {
        super(id);
    }

    getBaseWinChance() {
        return Math.floor(this.baseWinChance);
    }

    getItem() {
        return this.item;
    }

    static create(
        item: Item,
        baseWinChance: number,
        id?: number
    ): Operation<BannerItem> {
        const validation = Operation.combine([
            Guard.againstIllegal({baseWinChance})
        ]);
        if (!validation.wasSuccessful) {
            return Operation.fail(validation.getError());
        }

        return Operation.ok(new BannerItem(item, baseWinChance, id));
    }
}