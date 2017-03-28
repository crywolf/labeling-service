import * as chai from 'chai';
import {expect} from 'chai';
import ReturnEntityLabels from './ReturnEntityLabels';
import {Query} from '../../coreEntities/Query';
import QueryExecutor from '../../coreEntities/QueryExecutor';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('ReturnEntityLabels query', () => {

    let query: Query;
    const executor: QueryExecutor = { fetch: () => Promise.resolve() };

    let req: {params: any};
    const res = { send: () => { return; } };
    const next = sinon.stub();

    let response;
    let fetch;

    beforeEach(() => {
        query = new ReturnEntityLabels(executor);
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
        const ownerId = '0002';
        const entityId = '0010';

        beforeEach(() => {
            req = {
                params: {
                    ownerId,
                    entityId
                }
            };
        });

        describe('without querystring', () => {
            beforeEach(() => {
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: []}
                );
            });
        });

        describe('with "labelTypes=someType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(
                    ownerId, entityId, {labelTypes: ['someType'], labelValues: []}
                );
            });
        });

        describe('with "labelTypes=someType,anotherType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType,anotherType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(
                    ownerId, entityId, {labelTypes: ['someType', 'anotherType'], labelValues: []}
                );
            });
        });

        describe('with "labelValues=someValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: ['someValue']}
                );
            });
        });

        describe('with "labelValues=someValue,anotherValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue,anotherValue';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: ['someValue', 'anotherValue']}
                );
            });
        });
    });

});
