import * as sqlite from 'sqlite';
import logger from '../logger';

interface Config {
    filename: string;
    labelsTable: string;
    restrictionsTable: string;
}

class SqliteStorageService {

    private static singleton: SqliteStorageService;

    private connection: sqlite.Database;
    private config: Config;

    private constructor () {}

    public init (config: Config): Promise<sqlite.Database> {
        logger.module(this.constructor.name);
        logger.info('Connecting to DB...');

        return sqlite.open(config.filename)
            .then((db) => {
                this.connection = db;
                this.config = config;
                logger.info('DB Connected.');
                return this.createLabelsDb()
                    .then(() => {
                        return this.createRestrictionsDb();
                    })
                    .then(() => {
                        return this.db;
                    });
            });
    }

    get db () {
        if (!this.connection) {
            throw new Error('Sqlite not connected. Run #init() first!');
        }
        return this.connection;
    }

    static get instance (): SqliteStorageService {
        if (!this.singleton) {
            this.singleton = new SqliteStorageService();
        }
        return this.singleton;
    }

    public truncate () {
        const sql1 = `DELETE FROM ${this.config.labelsTable}`;
        const sql2 = `DELETE FROM ${this.config.restrictionsTable}`;
        return this.db.run(sql1)
            .then(() => {
                return this.db.run(sql2);
            })
            .then(() => {
                logger.info('Tables truncated.');
            });
    }

    private createLabelsDb () {
        const sql = `
                CREATE TABLE IF NOT EXISTS ${this.config.labelsTable} (
                    id INTEGER PRIMARY KEY,
                    ownerId INTEGER NOT NULL,
                    entityId INTEGER NOT NULL,
                    entityType CHAR(255) NOT NULL,
                    type CHAR(255) NOT NULL,
                    value CHAR(255)          
                );`;

        const uniqueIndexSql1 = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueLabelsWithValue 
                    ON ${this.config.labelsTable} (
                        ownerId,
                        entityId,
                        entityType,
                        type,
                        value          
                    ) WHERE value IS NOT NULL;
                `;

        const uniqueIndexSql2 = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueLabelsWoValue 
                    ON ${this.config.labelsTable} (
                        ownerId,
                        entityId,
                        entityType,
                        type  
                    ) WHERE value IS NULL;
                `;

        return this.db.run(sql)
            .then(() => {
                return this.db.run(uniqueIndexSql1);
            })
            .then(() => {
                return this.db.run(uniqueIndexSql2);
            });
    }

    private createRestrictionsDb () {
        const sql = `
                CREATE TABLE IF NOT EXISTS ${this.config.restrictionsTable} (
                    id INTEGER PRIMARY KEY,
                    ownerId INTEGER NOT NULL,
                    labelType CHAR(255) NOT NULL,
                    entityType CHAR(255),
                    hash CHAR(255) NOT NULL
                );`;

        const uniqueIndexSql1 = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueRestrictionsWithEntityType 
                    ON ${this.config.restrictionsTable} (
                        ownerId,
                        labelType,
                        entityType
                    ) WHERE entityType IS NOT NULL;
                `;

        const uniqueIndexSql2 = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueRestrictionsWoEntityType 
                    ON ${this.config.restrictionsTable} (
                        ownerId,
                        labelType
                    ) WHERE entityType IS NULL;
                `;

        return this.db.run(sql)
            .then(() => {
                return this.db.run(uniqueIndexSql1);
            })
            .then(() => {
                return this.db.run(uniqueIndexSql2);
            });
    }
}

const sqlStorageService = SqliteStorageService.instance;

export default sqlStorageService;
