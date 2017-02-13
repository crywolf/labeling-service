import Store from '../lib/store/Store';

enum Method { GET }

interface QuerySettings {
    method: Method;
    url: string;
}

abstract class Query {

    protected store: Store;

    protected settings: QuerySettings;

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
        this.response(req)
            .then((data) => {
                res.send(data);
                next();
            });
    }

    protected abstract response (req): Promise<any>;

}

export default Query;
export {Query, Method, QuerySettings};
