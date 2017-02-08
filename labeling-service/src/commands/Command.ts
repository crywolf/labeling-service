interface CommandSettings {
    method: string;
    url: string;
}

abstract class Command {

    protected settings: CommandSettings;

    get method (): string {
        return this.settings.method;
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
