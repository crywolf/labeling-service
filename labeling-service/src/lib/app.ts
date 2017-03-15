import logger from './logger';
import server from './server';
import RestifyRouter from './router/RestifyRouter';
import CommandBuilder from '../coreEntities/CommandBuilder';
import QueryBuilder from '../coreEntities/QueryBuilder';
import StorageService from './store/StorageService';

const app = (storageService: StorageService, config) => {
    return storageService.init(config.sqlite)
        .then(() => {
            const storage = storageService.db;
            const router = new RestifyRouter(new QueryBuilder(storage), new CommandBuilder(storage));
            server.registerRoutes(router);
            server.listen();
        })
        .catch((err) => {
            logger.error(`${err.message}\n${err.stack}`, 'App');
        });
};

export {app};
