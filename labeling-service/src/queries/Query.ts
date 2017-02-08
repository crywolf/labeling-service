interface QuerySettings {
    method: string;
    url: string;
}

abstract class Query {

    protected settings: QuerySettings;

    get method (): string {
        return this.settings.method;
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

    protected abstract response (req): Promise<string>;

}

export default Query;
