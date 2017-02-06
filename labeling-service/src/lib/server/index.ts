import {config} from '../../config';
import {HttpServer} from './HttpServer';

export const server = new HttpServer(config);
