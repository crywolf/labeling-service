import Store from '../lib/store/Store';

enum Method { POST, PUT, DELETE }

interface CommandSettings {
    method: Method;
    url: string;
}

abstract class Command {

    protected store: Store;

    protected settings: CommandSettings;

    constructor (store: Store) {
        this.store = store;
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
            });
    }

    protected abstract process (req): Promise<any>;

}

export default Command;
export {Command, Method, CommandSettings};
