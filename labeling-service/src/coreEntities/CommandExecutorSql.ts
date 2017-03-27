import CommandExecutor from './CommandExecutor';
import config from '../config';
import SqlDatabase from './SqlDatabase';
import Tables from './Tables';
import storageService from '../lib/store/sqliteStorageService';

abstract class CommandExecutorSql implements CommandExecutor {

    protected storage: SqlDatabase;
    protected tables: Tables;

    constructor (storage: SqlDatabase) {
        this.storage = storage;
        this.tables = {
                labelsTable: config.sqlite.labelsTable,
                restrictionsTable: config.sqlite.restrictionsTable
            };
    }

    public abstract execute (...args): Promise<any>;

    protected isUniqueConstraintError (err): boolean {
        return storageService.isUniqueConstraintError(err);
    }
}

export default CommandExecutorSql;
