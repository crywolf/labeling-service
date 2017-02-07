import logger from '../logger';
import * as restify from 'restify';
import Router from '../router/Router';
import {HttpServerInterface, ServerInterface as Server} from './HttpServerInterface';

logger.module('HttpServer');

export class HttpServer implements HttpServerInterface {
    private server: Server;

    constructor (private config) {
        this.server = restify.createServer({
            name: 'LabelingService'
        });
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
