import * as chai from 'chai';
import {expect} from 'chai';
import CreateLabelRelationship from './CreateLabelRelationship';
import {Command} from '../../coreEntities/Command';
import CommandExecutor from '../../coreEntities/CommandExecutor';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('CreateLabelRelationship command', () => {

    let command: Command;
    const executor: CommandExecutor = { execute: () => Promise.resolve() };

    let req: {params: any, body: any};
    const res = { send: () => { return; }};
    const next = sinon.stub();

    let process;
    let execute;

    beforeEach(() => {
        command = new CreateLabelRelationship(executor);
        process = sinon.spy(command, 'process');
        execute = sinon.spy(executor, 'execute');
    });

    afterEach(() => {
        process.restore();
        execute.restore();
    });

    describe('#handler', () => {
        it('calls process() with request data', () => {
            req = { params: 'someRequestData', body: 'someBodyData' };
            command.handler(req, res, next);
            expect(process).to.be.calledOnce;
            expect(process).to.be.calledWith(req);
        });
    });

    describe('#process', () => {
        const entityType = 'entityA';
        const entityId = '4';
        const params = { ownerId: '2' };

        describe('with complete request data', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityId,
                        entityType,
                        type: 'color',
                        value: 'black'
                    }
                };
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;

                const expected = {
                    ownerId: 2,
                    entityId: 4,
                    entityType,
                    type: 'color',
                    value: 'black'
                };
                expect(execute).to.be.calledWith(expected);
                return expect(process.getCall(0).returnValue).to.be.fulfilled;
            });
        });

        describe('without entityId value in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityType,
                        type: 'color',
                        value: 'black'
                    }
                };
                command.handler(req, res, next);
            });

            it('should reject with validation error', () => {
                expect(execute).not.to.be.called;
                return expect(process.getCall(0).returnValue).to.be.rejectedWith(UnprocessableEntityError);
            });
        });

        describe('without entityType value in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityId,
                        type: 'color',
                        value: 'black'
                    }
                };
                command.handler(req, res, next);
            });

            it('should reject with validation error', () => {
                expect(execute).not.to.be.called;
                return expect(process.getCall(0).returnValue).to.be.rejectedWith(UnprocessableEntityError);
            });
        });

        describe('without label type in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityId,
                        entityType,
                        value: 'black'
                    }
                };
                command.handler(req, res, next);
            });

            it('should reject with validation error', () => {
                expect(execute).not.to.be.called;
                return expect(process.getCall(0).returnValue).to.be.rejectedWith(UnprocessableEntityError);
            });
        });

        describe('without label value in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityId,
                        entityType,
                        type: 'color'
                    }
                };
                command.handler(req, res, next);
            });

            it('calls execute()', () => {
                expect(execute).to.be.calledOnce;
            });
        });
    });

});
