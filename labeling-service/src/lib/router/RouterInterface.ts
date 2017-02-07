import {HttpServerInterface as HttpServer} from '../server/ServerInterface';

interface RouterInterface {
    registerRoutes (server: HttpServer);
}

export default RouterInterface;
