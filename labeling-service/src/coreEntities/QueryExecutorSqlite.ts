import QueryExecutor from './QueryExecutor';
import {Database} from 'sqlite';
import config from '../config';

abstract class QueryExecutorSqlite implements QueryExecutor {

    protected storage: Database;
    protected tablename: string;

    constructor (storage: Database, tablename?: string) {
        this.storage = storage;
        this.tablename = tablename || config.sqlite.tablename;
    }

    public abstract fetch (...args): Promise<any>;

}

export default QueryExecutorSqlite;
