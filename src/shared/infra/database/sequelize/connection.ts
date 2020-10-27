import {
    Sequelize
} from "sequelize";
import {appConfig} from "../../../../config";


const { host, port, username, password, database } = appConfig.postgres;

// @ts-ignore
export const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: "postgres",
    logQueryParameters: true,
    define: {
        underscored: true
    }
});



require('../../../../subdomains/gacha/infra/database/sequelize/dao/backpack-slot').initialize(sequelize);
require('../../../../subdomains/gacha/infra/database/sequelize/dao/item').initialize(sequelize);
require('../../../../subdomains/gacha/infra/database/sequelize/dao/player').initialize(sequelize);

require('../../../../subdomains/gacha/infra/database/sequelize/dao/backpack-slot').associate();
require('../../../../subdomains/gacha/infra/database/sequelize/dao/player').associate();