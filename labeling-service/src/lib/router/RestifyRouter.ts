import logger from '../logger';
import Router from './Router';
import {RestifyHttpServer} from '../server/Server';
import QueryBuilder from '../../coreEntities/QueryBuilder';
import CommandBuilder from '../../coreEntities/CommandBuilder';

class RestifyRouter implements Router {

    protected queryBuilder: QueryBuilder;
    protected commandBuilder: CommandBuilder;

    constructor (queryBuilder: QueryBuilder, commandBuilder: CommandBuilder) {
        this.queryBuilder = queryBuilder;
        this.commandBuilder = commandBuilder;
    }

    public registerRoutes (server: RestifyHttpServer) {
        this.registerQueries(server);
        this.registerCommands(server);
    }

    private registerQueries (server: RestifyHttpServer) {
        const queries = this.queryBuilder.queries;
        queries.forEach((query) => {
            const method = query.method.toLowerCase();
            const url = query.url;
            const queryName = query.constructor.name;

            logger.info(`Registering route "${queryName}" ${method.toUpperCase()} ${url}`, this.constructor.name);
            server[method](url, query.handler.bind(query));
        });
    }

    private registerCommands (server: RestifyHttpServer) {
        const commands = this.commandBuilder.commands;
        commands.forEach((command) => {
            const methodName = command.method.toLowerCase();
            const method = (methodName === 'delete') ? 'del' : methodName;
            const url = command.url;
            const commandName = command.constructor.name;

            logger.info(`Registering route "${commandName}" ${methodName.toUpperCase()} ${url}`, this.constructor.name);
            server[method](url, command.handler.bind(command));
        });
    }

}

export default RestifyRouter;
