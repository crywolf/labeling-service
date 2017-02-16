abstract class QueryExecutor {

    protected storage: any;

    constructor (storage: any) {
        this.storage = storage;
    }

    public abstract fetch (...args): Promise<any>;

}

export default QueryExecutor;
