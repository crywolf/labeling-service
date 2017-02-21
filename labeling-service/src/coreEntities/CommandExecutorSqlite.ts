import CommandExecutor from './CommandExecutor';
import {Database} from 'sqlite';
import config from '../config';

abstract class CommandExecutorSqlite implements CommandExecutor {

    protected storage: Database;
    protected tablename: string;

    constructor (storage: Database, tablename?: string) {
        this.storage = storage;
        this.tablename = tablename || config.sqlite.tablename;
    }

    public abstract execute (...args): Promise<any>;
}

export default CommandExecutorSqlite;
