import * as sqlite from 'sqlite';
import logger from '../logger';

interface Config {
    filename: string;
}

class SqliteStorageService {

    private static singleton;

    private connection: sqlite.Database;

    public init (config: Config) {
        logger.module(this.constructor.name);
        logger.info('Connecting to DB...');

        return sqlite.open(config.filename)
            .then((db) => {
                logger.info('DB Connected.');
                this.connection = db;
                const sql = `CREATE TABLE IF NOT EXISTS labels (
                    id INTEGER PRIMARY KEY,
                    ownerId INTEGER,
                    entityId INTEGER,
                    entityType CHAR(255),
                    type CHAR(255),
                    value CHAR(255)          
                );`;
                return db.run(sql);
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

}

const sqlStorageService = SqliteStorageService.instance;

export default sqlStorageService;
