export const appConfig = {
    postgres: {
        host: process.env.POSTGRES_HOSTNAME,
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB || 'adventure',
        port: process.env.POSTGRES_PORT || 3306
    }
}