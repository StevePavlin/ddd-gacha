import {Item} from "../../../../domain/item";
import {ItemDao} from "../dao/item";

export class ItemMap {
    static toPersistence(item: Item): any {
        return {
            id: item.getId(),
            name: item.getName()
        }
    }

    static toDomain(itemDao: ItemDao): Item {
        return new Item(itemDao.name, itemDao.id);
    }
}