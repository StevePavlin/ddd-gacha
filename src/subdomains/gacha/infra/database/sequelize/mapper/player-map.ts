import {Player} from "../../../../domain/player";
import {Backpack} from "../../../../domain/backpack";
import {BackpackSlot} from "../../../../domain/backpack-slot";
import {Item} from "../../../../domain/item";


export class BackpackSlotMap {
    static toPersistence(slot: BackpackSlot, player: Player): any {
        return {
            id: slot.getId(),
            quantity: slot.getQuantity(),
            item_id: slot.getItem().getId(),
            position: slot.getPosition(),
            player_id: player.getId(),
        }
    }

    static toDomain(raw: any): BackpackSlot {

        return new BackpackSlot(
            new Item(raw.item.name, raw.item.id),
            raw.quantity,
            raw.position,
            raw.id,
        )
    }
}


export class PlayerMap {
    static toPersistence(player: Player): any {
        return {
            id: player.getId(),
            name: player.getName(),
            backpack_slots: player.getBackpack().getSlots().map(
                slot => BackpackSlotMap.toPersistence(slot, player)
            )
        }
    }

    static toDomain(raw: any): Player {
        const backpack = new Backpack(
            (raw.backpack_slots || []).map(
                (slot: any) => BackpackSlotMap.toDomain(slot)
            )
        )
        return new Player(raw.name, backpack, raw.id);
    }
}