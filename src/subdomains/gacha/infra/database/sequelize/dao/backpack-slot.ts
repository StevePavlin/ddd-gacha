import { Model, DataTypes } from "sequelize";
import {PlayerDao} from "./player";
import {ItemDao} from "./item";


export class BackpackSlotDao extends Model {
    public id: number;
    public quantity: number
    public position: number

    public item: ItemDao
    public player: PlayerDao
}

export function initialize(sequelize: any) {
    BackpackSlotDao.init(
        {
            quantity: {
                type: new DataTypes.INTEGER,
                allowNull: false
            },
            position: {
                type: new DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "backpack_slots",
            sequelize
        }
    )
}
export function associate() {
    BackpackSlotDao.belongsTo(ItemDao, {
        as: "item",
        foreignKey: {
            name: "item_id",
            allowNull: false
        }
    });
    BackpackSlotDao.belongsTo(PlayerDao, {
        as: "player",
        foreignKey: {
            name: "player_id",
            allowNull: false
        }
    })
}