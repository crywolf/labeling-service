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

describe('ReturnAllLabelRestrictions query', () => {

    let query: Query;
    const executor: QueryExecutor = { fetch: () => Promise.resolve() };

    let req: {params: any};
    const res = { send: () => { return; } };
    const next = sinon.stub();

    let response;
    let fetch;

    beforeEach(() => {
        query = new ReturnAllLabelRestrictions(executor);
        response = sinon.spy(query, 'response');
        fetch = sinon.spy(executor, 'fetch');
    });

    afterEach(() => {
        response.restore();
        fetch.restore();
    });

    describe('#handler', () => {
        it('calls response() with request data', () => {
            req = { params: 'someRequestData' };
            query.handler(req, res, next);
            expect(response).to.be.calledOnce;
            expect(response).to.be.calledWith(req);
        });
    });

    describe('#response', () => {
        const ownerId = '002';

        beforeEach(() => {
            req = {
                params: {
                    ownerId
                }
            };
        });

        describe('without querystring', () => {
            beforeEach(() => {
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {entityTypes: []});
            });
        });

        describe('with "entityTypes=someType"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {entityTypes: ['someType']});
            });
        });

        describe('with "entityTypes=someType,anotherType"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someType,anotherType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {entityTypes: ['someType', 'anotherType']});
            });
        });
    });

});
