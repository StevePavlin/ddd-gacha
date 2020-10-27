import { Model, DataTypes } from "sequelize";


export class ItemDao extends Model {
    public id: number;
    public name: string
}

export function initialize(sequelize: any) {
    ItemDao.init(
        {
            name: {
                type: new DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "items",
            sequelize
        }
    )
}