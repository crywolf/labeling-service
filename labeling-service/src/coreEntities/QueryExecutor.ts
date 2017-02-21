interface QueryExecutor {

    fetch (...args: Array<any>): Promise<any>;

}

export default QueryExecutor;
