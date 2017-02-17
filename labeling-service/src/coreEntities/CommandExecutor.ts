interface CommandExecutor {

    execute (...args): Promise<any>;

}

export default CommandExecutor;
