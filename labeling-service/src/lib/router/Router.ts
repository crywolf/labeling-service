import logger from '../logger';
import EntityLabelsQuery from '../../queries/EntityLabelsQuery';
import RouterInterface from './RouterInterface';
import {ServerInterface as Server} from '../server/HttpServerInterface';

class Router implements RouterInterface {
    public registerRoutes (server: Server) {

        const query = new EntityLabelsQuery();
        const method = query.method.toLowerCase();
        const url = query.url;

        logger.info(`Registering route ${method.toUpperCase()} ${url}`);
        server[method](url, query.handler.bind(query));
    }
}

export default Router;
