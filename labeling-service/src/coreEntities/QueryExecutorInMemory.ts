import QueryExecutor from './QueryExecutor';
import Label from './Label';

abstract class QueryExecutorInMemory implements QueryExecutor {

    protected storage: Set<Label>;

    constructor (storage: Set<Label>) {
        this.storage = storage;
    }

    public abstract fetch (...args): Promise<any>;

}

export default QueryExecutorInMemory;
