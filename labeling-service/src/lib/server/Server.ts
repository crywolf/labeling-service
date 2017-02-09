import logger from '../logger';
import * as restify from 'restify';
import Router from '../router/Router';
import {ServerInterface, HttpServerInterface as HttpServer} from './ServerInterface';

logger.module('HttpServer');

export class Server implements ServerInterface {
    private server: HttpServer;

    constructor (private config) {
        this.server = restify.createServer({
            name: 'LabelingService'
        });
        this.server.use(restify.queryParser());
        this.server.use(restify.bodyParser({mapParams: false}));
        // TODO use some authentication middleware
    }

    public registerRoutes (router: Router) {
        router.registerRoutes(this.server);
    }

    public listen () {
        const port = this.config.httpServer.port;
        const hostname = this.config.httpServer.hostname;

        this.server.listen(port, hostname, () => {
            logger.info(`${this.server.name} listening at ${this.server.url}`);
        });
    }
}
