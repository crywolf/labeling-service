import logger from '../logger';
import RouterInterface from './RouterInterface';
import {HttpServerInterface as HttpServer} from '../server/ServerInterface';

// import EntityLabelsQuery from '../../queries/EntityLabelsQuery';
// import AllEntitiesHavingLabelQuery from '../../queries/AllEntitiesHavingLabelQuery';

import * as queries from '../../queries';

class Router implements RouterInterface {

    public registerRoutes (server: HttpServer) {

        Object.keys(queries).forEach((queryName) => {
            const query = new (queries[queryName])();
            const method = query.method.toLowerCase();
            const url = query.url;

            logger.info(`Registering route ${method.toUpperCase()} ${url}`);
            server[method](url, query.handler.bind(query));
        });

    }

}

export default Router;
