import logger from '../logger';
import RouterInterface from './RouterInterface';
import {HttpServerInterface as HttpServer} from '../server/ServerInterface';

import * as queries from '../../queries';
import * as commands from '../../commands';

class Router implements RouterInterface {

    public registerRoutes (server: HttpServer) {
        this.registerQueries(server);
        this.registerCommands(server);
    }

    private registerQueries (server: HttpServer) {
        Object.keys(queries).forEach((queryName) => {
            const query = new (queries[queryName])();

            const method = query.method.toLowerCase();
            const url = query.url;

            logger.info(`Registering route ${method.toUpperCase()} ${url}`);
            server[method](url, query.handler.bind(query));
        });
    }

    private registerCommands (server: HttpServer) {
        Object.keys(commands).forEach((commandName) => {
            const command = new (commands[commandName])();

            let method = command.method.toLowerCase();
            method = (method === 'delete') ? 'del' : method;
            const url = command.url;

            logger.info(`Registering route ${method.toUpperCase()} ${url}`);
            server[method](url, command.handler.bind(command));
        });
    }

}

export default Router;
