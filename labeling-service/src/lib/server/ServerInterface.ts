import Router from '../router/Router';
import {Server} from 'http';

export interface ServerInterface {
    registerRoutes (router: Router);
    listen ();
}

export interface HttpServerInterface extends Server {
    name: string;
    url: string;
    use (plugin: any);
}

export default ServerInterface;
