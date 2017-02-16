abstract class CommandExecutor {

    protected storage: any;

    constructor (storage: any) {
        this.storage = storage;
    }

    public abstract execute (...args): Promise<any>;

}

export default CommandExecutor;
