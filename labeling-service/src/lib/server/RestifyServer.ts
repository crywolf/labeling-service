import logger from '../logger';
import * as restify from 'restify';
import RestifyRouter from '../router/RestifyRouter';
import {Server, RestifyHttpServer} from './Server';

export class RestifyServer implements Server {
    private server: RestifyHttpServer;

    constructor (private config) {
        this.server = restify.createServer({
            name: 'LabelingService'
        });
        this.server.use(restify.queryParser());
        this.server.use(restify.bodyParser({mapParams: false}));
        // TODO use some authentication middleware
    }

    public registerRoutes (router: RestifyRouter) {
        router.registerRoutes(this.server);
    }

    public listen () {
        const port = this.config.httpServer.port;
        const hostname = this.config.httpServer.hostname;
        logger.module(this.constructor.name);

        this.server.listen(port, hostname, () => {
            logger.info(`${this.server.name} listening at ${this.server.url}`);
        });

        this.server.on('InternalServer', (req, res, err, cb) => {
            logger.error('InternalServerError! ' + err.message);
            err.body.message = 'Something went wrong!';
            return cb();
        });
    }
}
