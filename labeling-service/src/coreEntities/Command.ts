import CommandExecutor from './CommandExecutor';

enum Method { POST, PUT, DELETE }

interface CommandSettings {
    method: Method;
    url: string;
}

abstract class Command {

    protected executor: CommandExecutor;

    protected settings: CommandSettings;

    constructor (executor: CommandExecutor) {
        this.executor = executor;
    }

    get method (): string {
        return Method[this.settings.method];
    }

    get url (): string {
        return this.settings.url;
    }

    public handler (req, res, next): void {
        this.process(req)
            .then((data) => {
                res.send(data);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    protected abstract process (req): Promise<any>;

}

export default Command;
export {Command, Method, CommandSettings};
