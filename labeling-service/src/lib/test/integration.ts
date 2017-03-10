process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import {expect} from 'chai';
import {app} from '../app';
import testConfig from '../../config';

chai.use(chaiHttp);

const hostname = 'localhost';
const port = 3000;
testConfig.httpServer.port = port;
testConfig.sqlite.filename = ':memory:';

let started;

const initApp = () => {
    if (started) {
        return Promise.resolve();
    }
    started = true;
    return app(testConfig);
};

const request = chai.request(`http://${hostname}:${port}`);

export {initApp, request, expect}
