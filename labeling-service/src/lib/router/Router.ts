export class Router {
    public registerRoutes (server) {

        function respond (req, res, next) {
            res.send('hello ' + req.params.name);
            next();
        }

        server.get('/hello/:name', respond);
        server.head('/hello/:name', respond);
    }
}
