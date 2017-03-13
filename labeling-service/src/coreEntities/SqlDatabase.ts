interface SqlDatabase {

    run (sql: string, ...params: Array<any>): Promise<any>;
    all (sql: string, ...params: Array<any>): Promise<Array<any>>;

}

export default SqlDatabase;
