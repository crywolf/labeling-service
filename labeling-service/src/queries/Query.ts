import QuerySettings from './Settings.interface';

abstract class Query {

    protected settings: QuerySettings;

    get method (): string {
        return this.settings.method;
    }

    get url (): string {
        return this.settings.url;
    }

    public handler (req, res, next): void {
        res.send(this.response(req));
        next();
    }

    protected abstract response (req): string;

}

export default Query;
