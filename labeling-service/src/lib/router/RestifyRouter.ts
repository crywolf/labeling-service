import logger from '../logger';
import Router from './Router';
import {RestifyHttpServer} from '../server/Server';

import * as queries from '../../C&Q/queries';
import * as commands from '../../C&Q/commands';

import queryExecutors from '../../C&Q/queries/executors';
import commandExecutors from '../../C&Q/commands/executors';

import {Command} from '../../coreEntities/Command';
import {Query} from '../../coreEntities/Query';

class RestifyRouter implements Router {

    public registerRoutes (server: RestifyHttpServer) {
        this.registerQueries(server);
        this.registerCommands(server);
    }

    private registerQueries (server: RestifyHttpServer) {
        Object.keys(queries).forEach((queryName) => {
            const queryConstructor = queries[queryName];
            const queryExecutor = queryExecutors[queryName];

            const query = new (queryConstructor)(queryExecutor) as Query;

            const method = query.method.toLowerCase();
            const url = query.url;

            logger.info(`Registering route "${queryName}" ${method.toUpperCase()} ${url}`);
            server[method](url, query.handler.bind(query));
        });
    }

    private registerCommands (server: RestifyHttpServer) {
        Object.keys(commands).forEach((commandName) => {
            const commandConstructor = commands[commandName];
            const commandExecutor = commandExecutors[commandName];

            const command = new (commandConstructor)(commandExecutor) as Command;

            const methodName = command.method.toLowerCase();
            const method = (methodName === 'delete') ? 'del' : methodName;
            const url = command.url;

            logger.info(`Registering route "${commandName}" ${methodName.toUpperCase()} ${url}`);
            server[method](url, command.handler.bind(command));
        });
    }

}

export default RestifyRouter;
