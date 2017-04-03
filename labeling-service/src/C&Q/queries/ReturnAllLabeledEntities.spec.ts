import * as chai from 'chai';
import {expect} from 'chai';
import ReturnAllLabeledEntities from './ReturnAllLabeledEntities';
import {Query} from '../../coreEntities/Query';
import QueryExecutor from '../../coreEntities/QueryExecutor';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('ReturnAllLabeledEntities query', () => {

    let query: Query;
    const executor: QueryExecutor = { fetch: () => Promise.resolve() };

    let req: {params: any};
    const res = { send: () => { return; } };
    const next = sinon.stub();

    let response;
    let fetch;

    beforeEach(() => {
        query = new ReturnAllLabeledEntities(executor);
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
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelTypes=someType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: ['someType'],
                    typesOperator: 'OR',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelTypes=someType,anotherType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType,anotherType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: ['someType', 'anotherType'],
                    typesOperator: 'OR',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelTypes=someType;anotherType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType;anotherType';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: ['someType', 'anotherType'],
                    typesOperator: 'AND',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelValues=someValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: ['someValue'],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelValues=someValue,anotherValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue,anotherValue';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: ['someValue', 'anotherValue'],
                    valuesOperator: 'OR',
                    entityTypes: []
                });
            });
        });

        describe('with "labelValues=someValue;anotherValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue;anotherValue';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: ['someValue', 'anotherValue'],
                    valuesOperator: 'AND',
                    entityTypes: []
                });
            });
        });

        describe('with "entityTypes=someEntity"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someEntity';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: ['someEntity']
                });
            });
        });

        describe('with "entityTypes=someEntity,anotherEntity"', () => {
            beforeEach(() => {
                req.params.entityTypes = 'someEntity,anotherEntity';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: [],
                    typesOperator: 'OR',
                    labelValues: [],
                    valuesOperator: 'OR',
                    entityTypes: ['someEntity', 'anotherEntity']
                });
            });
        });

        // tslint:disable-next-line:max-line-length
        describe('with "labelTypes=someType,anotherType&labelValues=someValue,anotherValue&entityTypes=someEntity,anotherEntity"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType,anotherType';
                req.params.labelValues = 'someValue,anotherValue';
                req.params.entityTypes = 'someEntity,anotherEntity';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: ['someType', 'anotherType'],
                    typesOperator: 'OR',
                    labelValues: ['someValue', 'anotherValue'],
                    valuesOperator: 'OR',
                    entityTypes: ['someEntity', 'anotherEntity']
                });
            });
        });

        // tslint:disable-next-line:max-line-length
        describe('with "labelTypes=someType;anotherType&labelValues=someValue;anotherValue&entityTypes=someEntity,anotherEntity"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType;anotherType';
                req.params.labelValues = 'someValue;anotherValue';
                req.params.entityTypes = 'someEntity,anotherEntity';
                query.handler(req, res, next);
            });

            it('calls fetch() with correct parameters', () => {
                expect(fetch).to.be.calledOnce;
                expect(fetch).to.be.calledWith(ownerId, {
                    labelTypes: ['someType', 'anotherType'],
                    typesOperator: 'AND',
                    labelValues: ['someValue', 'anotherValue'],
                    valuesOperator: 'AND',
                    entityTypes: ['someEntity', 'anotherEntity']
                });
            });
        });
    });

});
