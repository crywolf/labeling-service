import logger from '../logger';
import EntityLabelsQuery from '../../queries/EntityLabelsQuery';
import RouterInterface from './RouterInterface';
import {HttpServerInterface as HttpServer} from '../server/ServerInterface';

class Router implements RouterInterface {

    public registerRoutes (server: HttpServer) {
        const query = new EntityLabelsQuery();
        const method = query.method.toLowerCase();
        const url = query.url;

        logger.info(`Registering route ${method.toUpperCase()} ${url}`);
        server[method](url, query.handler.bind(query));
    }

}

export default Router;
