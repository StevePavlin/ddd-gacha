import {IItemRepo, IPlayerRepo} from "../../interfaces";
import {Item} from "../../../../domain/item";
import {ItemDao} from "../dao/item";
import {ItemMap} from "../mapper/item-map";
import {Transaction} from "sequelize";
import {IUnitOfWork} from "../../../../../../shared/infra/database/interfaces";

export class SequelizeItemRepo implements IItemRepo {

    private transaction: Transaction | undefined;

    private getTransaction() {
        return {
            transaction: this.transaction
        }
    }

    async findById(id: number): Promise<Item> {
        const dao = await ItemDao.findOne({
            ...this.getTransaction(),
            where: {
                id
            }
        })

        if (dao) {
            return ItemMap.toDomain(dao);
        } else {
            throw new Error('Not found')
        }
    }

    async findByName(name: string): Promise<Item> {
        const dao = await ItemDao.findOne({
            ...this.getTransaction(),
            where: {
                name
            }
        })

        if (dao) {
            return ItemMap.toDomain(dao);
        } else {
            throw new Error('Not found')
        }
    }


    async save(item: Item): Promise<void> {
        const raw = ItemMap.toPersistence(item);

        const instance = await ItemDao.findByPk(raw.id, {
            ...this.getTransaction()
        });

        if (instance) {
            await instance.update(raw, {
                ...this.getTransaction()
            })
        } else {
            await ItemDao.create(raw, {
                ...this.getTransaction()
            });
        }
    }

    provideUnitOfWork(unitOfWork: IUnitOfWork) {
        this.transaction = <Transaction>unitOfWork;
    }
}