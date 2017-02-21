interface CommandExecutor {

    execute (...args: Array<any>): Promise<any>;

}

export default CommandExecutor;
