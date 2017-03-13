import QueryExecutor from './QueryExecutor';
import config from '../config';
import SqlDatabase from './SqlDatabase';
import Tables from './Tables';

abstract class QueryExecutorSql implements QueryExecutor {

    protected storage: SqlDatabase;
    protected tables: Tables;

    constructor (storage: SqlDatabase, tables?: Tables) {
        this.storage = storage;
        this.tables = tables || {
                labelsTable: config.sqlite.labelsTable,
                restrictionsTable: config.sqlite.restrictionsTable
            };
    }

    public abstract fetch (...args): Promise<any>;

}

export default QueryExecutorSql;
