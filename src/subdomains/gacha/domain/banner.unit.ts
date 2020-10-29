import {Player} from "./player";
import {Item} from "./item";
import { assert, expect } from "chai";
import {Banner} from "./banner";
import {BannerItem} from "./banner-item";


function bannerFactory(
    name?: string,
    imageUrl?: string,
    items?: BannerItem[]
) {
    const defaultProps = {
        name: 'Klee Banner',
        imageUrl: 'https://cdn.mos.cms.futurecdn.net/WLc6FYzQEN3SyiWonzVsw9-1200-80.jpg',
        items: [
            BannerItem.create(
                new Item('Health Potion', 1),
                50
            ).getValue(),
            BannerItem.create(
                new Item('Mana Potion', 2),
                50
            ).getValue()
        ]
    }

    return Banner.create(
        name || defaultProps.name,
        imageUrl || defaultProps.imageUrl,
        items || defaultProps.items
    )
}

describe('Creating a banner', () => {

    // Covers validation branch complexity
    it('should fail if the names length is < 5', () => {
        const operation = bannerFactory(
            'Klee',
            undefined
        );

        expect(operation.wasSuccessful).to.be.false;
        expect(operation.getError()).to.equal('Length of string "Klee" is less than 5')
    })

    it('should fail if the item chances do not add up to 100%', () => {
        const operation = bannerFactory(
            undefined,
            undefined,
            []
        );

        expect(operation.wasSuccessful).to.be.false;
        expect(operation.getError()).to.equal('Base item win chances must add up to 100%')
    })

    it('should fail if an item is duplicated by id', () => {
        const operation = bannerFactory(
            undefined,
            undefined,
            [
                BannerItem.create(
                    new Item('Health Potion', 1),
                    50
                ).getValue(),
                BannerItem.create(
                    new Item('Health Potion', 1),
                    50
                ).getValue()
            ]
        );

        expect(operation.wasSuccessful).to.be.false;
        expect(operation.getError()).to.equal('One or more items are duplicated')
    })

    // Happy path
    it('should create a valid banner', () => {
        const operation = bannerFactory();

        expect(operation.wasSuccessful).to.be.true;
    })
})
describe('Getting a random item from the banner', () => {
    it('should create get a health potion out of the banner (r=0, r=0.5)', () => {
        const operation = bannerFactory();
        const banner = operation.getValue();

        const item1: Item = banner.getRandomItem(0);
        expect(item1.getName()).to.equal('Health Potion');


        const item2: Item = banner.getRandomItem(0.5);
        expect(item2.getName()).to.equal('Health Potion');
    });

    it('should create get a mana potion out of the banner (r=1)', () => {
        const operation = bannerFactory();
        const banner = operation.getValue();

        const item: Item = banner.getRandomItem(1);

        expect(item.getName()).to.equal('Mana Potion');
    })
})