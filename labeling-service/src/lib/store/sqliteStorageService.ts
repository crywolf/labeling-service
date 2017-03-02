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

    public init (config: Config) {
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

    private createLabelsDb () {
        const sql = `
                CREATE TABLE IF NOT EXISTS ${this.config.labelsTable} (
                    id INTEGER PRIMARY KEY,
                    ownerId INTEGER,
                    entityId INTEGER,
                    entityType CHAR(255),
                    type CHAR(255),
                    value CHAR(255)          
                );`;

        const uniqueIndexSql = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueLabels 
                ON ${this.config.labelsTable} (
                    ownerId,
                    entityId,
                    entityType,
                    type,
                    value          
                );`;

        return this.db.run(sql)
            .then(() => {
                return this.db.run(uniqueIndexSql);
            });
    }

    private createRestrictionsDb () {
        const sql = `
                CREATE TABLE IF NOT EXISTS ${this.config.restrictionsTable} (
                    id INTEGER PRIMARY KEY,
                    ownerId INTEGER,
                    labelType CHAR(255),
                    entityType CHAR(255),
                    hash CHAR(255)
                );`;

        const uniqueIndexSql = `
                CREATE UNIQUE INDEX IF NOT EXISTS uniqueRestrictions 
                ON ${this.config.restrictionsTable} (
                    ownerId,
                    labelType,
                    entityType
                );`;

        return this.db.run(sql)
            .then(() => {
                return this.db.run(uniqueIndexSql);
            });
    }
}

const sqlStorageService = SqliteStorageService.instance;

export default sqlStorageService;
