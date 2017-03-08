import * as chai from 'chai';
import {expect} from 'chai';
import ReturnAllLabelRestrictions from './ReturnAllLabelRestrictions';
import {Query} from '../../coreEntities/Query';
import QueryExecutor from '../../coreEntities/QueryExecutor';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('ReturnAllLabelRestrictions command', () => {

    let command: Query;
    const executor: QueryExecutor = { fetch: () => Promise.resolve() };

    let req: {params: any};
    const res = { send: () => { return; } };
    const next = sinon.stub();

    let response;
    let fetch;

    beforeEach(() => {
        command = new ReturnAllLabelRestrictions(executor);
        response = sinon.spy(command, 'response');
        fetch = sinon.spy(executor, 'fetch');
    });

    afterEach(() => {
        response.restore();
        fetch.restore();
    });

    describe('#handler', () => {
        it('calls response() with request data', () => {
            req = { params: 'someRequestData' };
            command.handler(req, res, next);
            expect(response).to.be.calledOnce;
            expect(response).to.be.calledWith(req);
        });
    });

    describe('#response', () => {
        beforeEach(() => {
            req = {
                params: {
                    ownerId: '2'
                }
            };
        });

        describe('without querystring', () => {
            beforeEach(() => {
                command.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(2, {entityTypes: []});
            });
        });

        describe('with "entityTypes=someType"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someType';
                command.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(2, {entityTypes: ['someType']});
            });
        });

        describe('with "entityTypes=someType,anotherType"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someType,anotherType';
                command.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(2, {entityTypes: ['someType', 'anotherType']});
            });
        });
    });

});
