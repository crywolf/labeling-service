import CommandExecutor from './CommandExecutor';
import Label from './Label';

abstract class CommandExecutorInMemory implements CommandExecutor {

    protected storage: Set<Label>;

    constructor (storage: Set<Label>) {
        this.storage = storage;
    }

    public abstract execute (...args): Promise<any>;
}

export default CommandExecutorInMemory;
