import {IPlayerRepo} from "../../interfaces";
import {Player} from "../../../../domain/player";
import {PlayerDao} from "../dao/player";
import {PlayerMap} from "../mapper/player-map";
import {BackpackSlotDao} from "../dao/backpack-slot";
import {ItemDao} from "../dao/item";
import {Transaction} from "sequelize";
import {IUnitOfWork} from "../../../../../../shared/infra/database/interfaces";

export class SequelizePlayerRepo implements IPlayerRepo {

    private transaction: Transaction | undefined;

    private getBaseQuery() {
        return {
            include: [{
                include: [{
                    model: ItemDao,
                    as: "item"
                }],
                model: BackpackSlotDao,
                as: "backpack_slots"
            }]
        };
    }

    private getTransaction() {
        return {
            transaction: this.transaction
        }
    }


    async findById(id: number): Promise<Player> {
        const dao = await PlayerDao.findOne({
            ...this.getBaseQuery(),
            ...this.getTransaction(),
            where: {
                id
            }
        })

        if (dao) {
            return PlayerMap.toDomain(dao);
        } else {
            throw new Error('Not found')
        }
    }

    async findByName(name: string): Promise<Player> {
        const dao = await PlayerDao.findOne({
            ...this.getBaseQuery(),
            ...this.getTransaction(),
            where: {
                name
            }
        })

        if (dao) {
            return PlayerMap.toDomain(dao);
        } else {
            throw new Error('Not found')
        }
    }

    async save(player: Player): Promise<void> {
        const raw = PlayerMap.toPersistence(player);

        if (player.getId()) {
            const instance = await PlayerDao.findOne({
                ...this.getBaseQuery(),
                ...this.getTransaction(),
                where: {
                    id: player.getId()
                }
            });

            if (instance) {
                await instance.update(raw);

                await Promise.all(
                    (instance.backpack_slots || []).map(
                        (slot, index) => {
                            if (slot.id) {
                                return slot.update(raw.backpack_slots[index], {
                                    ...this.getTransaction()
                                })
                            } else {
                                return BackpackSlotDao.create(raw.backpack_slots[index], {
                                    ...this.getTransaction()
                                })
                            }
                        }
                    )
                )
            }

        } else {
            await PlayerDao.create(raw, {
                ...this.getTransaction()
            });
        }
    }

    provideUnitOfWork(unitOfWork: IUnitOfWork) {
        this.transaction = <Transaction>unitOfWork;
    }
}