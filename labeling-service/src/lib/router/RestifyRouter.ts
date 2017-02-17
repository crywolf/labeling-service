import logger from '../logger';
import Router from './Router';
import {RestifyHttpServer} from '../server/Server';
import QueryBuilder from '../../coreEntities/QueryBuilder';
import CommandBuilder from '../../coreEntities/CommandBuilder';
import storage from '../store/memoryStorage';

class RestifyRouter implements Router {

    public registerRoutes (server: RestifyHttpServer) {
        this.registerQueries(server);
        this.registerCommands(server);
    }

    private registerQueries (server: RestifyHttpServer) {
        const queries = new QueryBuilder(storage).queries;
        queries.forEach((query) => {
            const method = query.method.toLowerCase();
            const url = query.url;
            const queryName = query.constructor.name;

            logger.info(`Registering route "${queryName}" ${method.toUpperCase()} ${url}`);
            server[method](url, query.handler.bind(query));
        });
    }

    private registerCommands (server: RestifyHttpServer) {
        const commands = new CommandBuilder(storage).commands;
        commands.forEach((command) => {
            const methodName = command.method.toLowerCase();
            const method = (methodName === 'delete') ? 'del' : methodName;
            const url = command.url;
            const commandName = command.constructor.name;

            logger.info(`Registering route "${commandName}" ${methodName.toUpperCase()} ${url}`);
            server[method](url, command.handler.bind(command));
        });
    }

}

export default RestifyRouter;
