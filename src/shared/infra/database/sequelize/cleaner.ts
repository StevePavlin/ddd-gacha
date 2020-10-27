import {IDbCleaner} from "../interfaces";
import {sequelize} from "./connection";

/**
 * In prod integration tests, this usually becomes the following:
 *
 * setup():
 * 1. Recreate all foreign key constraints from RESTRICT to CASCADE
 *
 * clean():
 * 1. For each table => DELETE * FROM ${table} (avoiding TRUNCATE as its slow with big databases!)
 * 2. Run global seed data
 */

export class SequelizeDbCleaner implements IDbCleaner {

    async setup() {

    }

    async clean() {
        await sequelize.sync({ force: true });
    }
}