import Router from '../router/Router';
import {Server as HttpServer} from 'http';

interface Server {
    registerRoutes (router: Router);
    listen ();
}

interface RequestHandler {
    (req: any, res: any, next: any);
}

interface RestifyHttpServer extends HttpServer {
    name: string;
    url: string;
    use (plugin: RequestHandler): Server;
}

export default Server;
export {Server, RestifyHttpServer, HttpServer};
