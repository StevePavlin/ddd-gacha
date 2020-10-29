import {AggregateRoot} from "../../../shared/kernel/AggregateRoot";
import {Player} from "./player";
import {Guard} from "../../../shared/kernel/Guard";
import {Operation} from "../../../shared/kernel/Operation";
import {BannerItem} from "./banner-item";
import {Item} from "./item";

/**
 * "Banner" in the ubiquitous language of genshin impact
 * Maybe we end up calling it "Promo"
 */
export class Banner extends AggregateRoot {

    private constructor(
        private name: string,
        private imageUrl: string,
        private bannerItems: BannerItem[],
        id?: number
    ) {
        super(id);
    }


    /**
     *
     * @param random in range [0, 1). ex. Math.random
     */
    getRandomItem(random: number) {
        // Gross up random
        const randomInteger = (random * 100)

        // Weighted random impl
        let tally = 0;

        for (let bannerItem of this.bannerItems) {
            tally += bannerItem.getBaseWinChance();

            if (randomInteger <= tally) {
                return bannerItem.getItem();
            }
        }

        throw new Error(`Unable to get random item: ${random}`);
    }

    static create(
        name: string,
        imageUrl: string,
        bannerItems: BannerItem[],
        id?: number
    ): Operation<Banner> {
        const validation = Operation.combine([
            Guard.againstIllegal({name, imageUrl}),
            Guard.assertStringIsAtLeast(name, 5)
        ]);

        if (!validation.wasSuccessful) {
            return Operation.fail(validation.getError());
        }

        const totalChance = bannerItems.reduce(
            (t, item) => t + item.getBaseWinChance()
        , 0);

        if (totalChance !== 100) {
            return Operation.fail('Base item win chances must add up to 100%')
        }

        const uniqueItemIds = new Set(bannerItems.map(item => item.getItem().getId()));
        if (uniqueItemIds.size !== bannerItems.length) {
            return Operation.fail('One or more items are duplicated');
        }

        return Operation.ok(new Banner(name, imageUrl, bannerItems, id));
    }
}