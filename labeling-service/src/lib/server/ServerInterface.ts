import Router from '../router/Router';
import {Server} from 'http';

export interface ServerInterface {
    registerRoutes (router: Router);
    listen ();
}

interface RequestHandler {
    (req: any, res: any, next: any);
}

export interface HttpServerInterface extends Server {
    name: string;
    url: string;
    use (plugin: RequestHandler): Server;
}

export default ServerInterface;
