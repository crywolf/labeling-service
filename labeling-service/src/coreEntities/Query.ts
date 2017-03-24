import QueryExecutor from './QueryExecutor';

enum Method { GET }

interface QuerySettings {
    method: Method;
    url: string;
}

abstract class Query {

    protected executor: QueryExecutor;

    protected abstract readonly settings: QuerySettings;

    constructor (executor: QueryExecutor) {
        this.executor = executor;
    }

    get method (): string {
        return Method[this.settings.method];
    }

    get url (): string {
        return this.settings.url;
    }

    public handler (req, res, next): void {
        this.response(req)
            .then((data) => {
                res.send(data);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    protected abstract response (req): Promise<any>;

}

export default Query;
export {Query, Method, QuerySettings};
