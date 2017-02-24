import queries from '../C&Q/queries';
import queryExecutors from '../C&Q/queries/executors';
import Query from './Query';

class QueryBuilder {

    private storage;

    constructor (storage) {
        if (storage === undefined) {
            throw new Error(`Provide valid storage! (${this.constructor.name})`);
        }
        this.storage = storage;
    }

    get queries (): Array<Query> {
        const qs = [];

        Object.keys(queries).forEach((queryName) => {
            const executorName = `${queryName}Executor`;
            const queryExecutorClass = queryExecutors[executorName];
            const queryExecutor = new (queryExecutorClass)(this.storage);

            const queryClass = queries[queryName];
            const query = new (queryClass)(queryExecutor);
            qs.push(query);
        });
        return qs;
    }
}

export default QueryBuilder;
