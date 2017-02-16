import CommandExecutor from './CommandExecutor';
import Label from './Label';

abstract class CommandExecutorInMemory extends CommandExecutor {

    protected storage: Set<Label>;

    constructor (storage: Set<Label>) {
        super(storage);
    }

}

export default CommandExecutorInMemory;
