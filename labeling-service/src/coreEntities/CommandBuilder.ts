import commands from '../C&Q/commands';
import commandExecutors from '../C&Q/commands/executors';
import Command from './Command';

class CommandBuilder {

    private storage;

    constructor (storage) {
        this.storage = storage;
    }

    get commands (): Array<Command> {
        const cs = [];

        Object.keys(commands).forEach((commandName) => {
            const executorName = `${commandName}Executor`;
            const commandExecutorClass = commandExecutors[executorName];
            const commandExecutor = new (commandExecutorClass)(this.storage);

            const commandClass = commands[commandName];
            const command = new (commandClass)(commandExecutor);
            cs.push(command);
        });
        return cs;
    }

}

export default CommandBuilder;
