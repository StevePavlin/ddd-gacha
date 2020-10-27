import { Model, DataTypes } from "sequelize";
import {BackpackSlotDao} from "./backpack-slot";


export class PlayerDao extends Model {
    public id: number;
    public name: string
    public backpack_slots?: BackpackSlotDao[];
}

export function initialize(sequelize: any) {
    PlayerDao.init(
        {
            name: {
                type: new DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "players",
            sequelize
        }
    )
}

export function associate() {
    PlayerDao.hasMany(BackpackSlotDao, {
        as: "backpack_slots",
        foreignKey: {
            name: "player_id",
            allowNull: false
        }
    });
}