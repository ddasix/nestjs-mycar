import { DataSource, DataSourceOptions } from "typeorm";

let dbOptions: DataSourceOptions = {
    type: 'sqlite',
    database: '',
    entities: [],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
};

switch(process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbOptions, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js']
        })
        break;
    case 'test':
        Object.assign(dbOptions, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true
        })
        break;
    case 'production':
        Object.assign(dbOptions, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnathorized: false
            }
        })
        break;
    default:
        throw new Error('알수없는 DB 환경설정입니다.');
}

export const dataSourceOptions: DataSourceOptions = dbOptions;

const dataSource = new DataSource(dataSourceOptions)

export default dataSource;
