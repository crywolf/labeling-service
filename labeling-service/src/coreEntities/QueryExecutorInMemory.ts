import QueryExecutor from './QueryExecutor';
import Label from './Label';

abstract class QueryExecutorInMemory extends QueryExecutor {

    protected storage: Set<Label>;

    constructor (storage: Set<Label>) {
        super(storage);
    }

}

export default QueryExecutorInMemory;
