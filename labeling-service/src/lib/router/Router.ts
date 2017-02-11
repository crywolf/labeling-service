import {HttpServer} from '../server/Server';

interface Router {
    registerRoutes (server: HttpServer);
}

export default Router;
