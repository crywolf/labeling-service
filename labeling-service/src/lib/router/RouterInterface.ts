import {ServerInterface as Server} from '../server/HttpServerInterface';

interface RouterInterface {
    registerRoutes (server: Server);
}

export default RouterInterface;
