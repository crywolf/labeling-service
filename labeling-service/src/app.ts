import logger from './lib/logger';
import config from './config';
import server from './lib/server';
import RestifyRouter from './lib/router/RestifyRouter';
import CommandBuilder from './coreEntities/CommandBuilder';
import QueryBuilder from './coreEntities/QueryBuilder';

// import storageService from './lib/store/memoryStorageService';
import storageService from './lib/store/sqliteStorageService';

storageService.init(config.sqlite)
    .then(() => {
//        const storage = storageService.storage;
        const storage = storageService.db;
        const router = new RestifyRouter(new QueryBuilder(storage), new CommandBuilder(storage));
        server.registerRoutes(router);
        server.listen();
    })
    .catch((err) => {
        logger.error((`${err.message}\n${err.stack}`), 'App');
    });
