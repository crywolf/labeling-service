import {logger} from '../logger';
import * as restify from 'restify';
import {Router} from '../router/Router';

logger.module('HttpServer');

export class HttpServer {
    private server;

    constructor (private config) {
        this.server = restify.createServer({
            name: 'LabelingService'
        });
    }

    public registerRoutes (router: Router) {
        logger.info('Registering routes');
        router.registerRoutes(this.server);
    }

    public listen () {
        this.server.listen(this.config.httpServer.port, this.config.httpServer.hostname, () => {
            logger.info(`${this.server.name} listening at ${this.server.url}`);
        });
    }
}
