process.env.NODE_ENV = 'testing';

import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import {expect} from 'chai';
import {app} from '../app';
import config from '../../config';
import StorageService from '../store/StorageService';
import sqliteStorageService from '../store/sqliteStorageService';

chai.use(chaiHttp);

let started;

const initApp = (storageService: StorageService = sqliteStorageService) => {
    if (started) {
        return Promise.resolve();
    }
    started = true;
    return app(storageService, config);
};

const hostname = config.httpServer.hostname;
const port = config.httpServer.port;

const request = chai.request(`http://${hostname}:${port}`);

const storageService = sqliteStorageService;

export {initApp, request, expect, storageService}
