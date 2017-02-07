import Router from '../router/Router';
import {Server} from 'http';

export interface HttpServerInterface {
    registerRoutes (router: Router);
    listen ();
}

export interface ServerInterface extends Server {
    name: string;
    url: string;
}

export default HttpServerInterface;
