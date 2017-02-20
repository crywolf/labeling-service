import {open as sqlite} from 'sqlite';

import logger from '../logger';

class SqliteStorageService {

    private static singleton;

    private connection;

    public init () {
        logger.module(this.constructor.name);
        logger.info('Connecting to DB...');

        return sqlite('./db.sqlite/labels.sqlite')
            .then((db) => {
                logger.info('DB Connected.');
                this.connection = db;
            });
    }

    get db () {
        if (!this.connection) {
            throw new Error('Sqlite not connected. Run #init() first!');
        }
        return this.connection;
    }

    static get instance () {
        if (!this.singleton) {
            this.singleton = new SqliteStorageService();
        }
        return this.singleton;
    }

}

const sqlStorageService = SqliteStorageService.instance;

export default sqlStorageService;
