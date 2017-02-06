import {server} from './lib/server';
import {router} from './lib/router';

server.registerRoutes(router);
server.listen();
