import QueryExecutor from './QueryExecutor';
import {Database} from 'sqlite';
import config from '../config';
import Tables from './Tables';

abstract class QueryExecutorSqlite implements QueryExecutor {

    protected storage: Database;
    protected tables: Tables;

    constructor (storage: Database, tables?: Tables) {
        this.storage = storage;
        this.tables = tables || {
                labelsTable: config.sqlite.labelsTable,
                restrictionsTable: config.sqlite.restrictionsTable
            };
    }

    public abstract fetch (...args): Promise<any>;

}

export default QueryExecutorSqlite;
