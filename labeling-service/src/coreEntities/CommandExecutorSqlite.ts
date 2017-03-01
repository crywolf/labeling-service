import CommandExecutor from './CommandExecutor';
import {Database} from 'sqlite';
import config from '../config';
import Tables from './Tables';

abstract class CommandExecutorSqlite implements CommandExecutor {

    protected storage: Database;
    protected tables: Tables;

    constructor (storage: Database, tables?: Tables) {
        this.storage = storage;
        this.tables = tables || {
                labelsTable: config.sqlite.labelsTable,
                restrictionsTable: config.sqlite.restrictionsTable
            };
    }

    public abstract execute (...args): Promise<any>;
}

export default CommandExecutorSqlite;
