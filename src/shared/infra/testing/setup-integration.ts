import "dotenv/config";
import "reflect-metadata";

import {SequelizeDbCleaner} from "../database/sequelize/cleaner";

before(async() => {
    await new SequelizeDbCleaner().setup();
})
beforeEach(async() => {
    await new SequelizeDbCleaner().clean();
})