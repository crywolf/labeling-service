import * as chai from 'chai';
import {expect} from 'chai';
import CreateLabelRestriction from './CreateLabelRestriction';
import {Command} from '../../coreEntities/Command';
import CommandExecutor from '../../coreEntities/CommandExecutor';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';
import * as chaiAsPromised from 'chai-as-promised';

chai.use(chaiSinon);
chai.use(chaiAsPromised);

describe('CreateLabelRestriction command', () => {

    let command: Command;
    const executor: CommandExecutor = { execute: () => Promise.resolve() };

    let req: {params: any, body: any};
    const res = { send: () => { return; }};
    const next = sinon.stub();

    let process;
    let execute;

    beforeEach(() => {
        command = new CreateLabelRestriction(executor);
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
        const labelType = 'someLabelType';
        const params = { ownerId: '002' };

        describe('with complete request data', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityType,
                        labelType
                    }
                };
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;

                const expected = {
                    ownerId: '002',
                    entityType,
                    labelType
                };
                expect(execute).to.be.calledWith(expected);
            });
        });

        describe('without labelType in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        entityType
                    }
                };
                command.handler(req, res, next);
            });

            it('should reject with validation error', () => {
                expect(execute).not.to.be.called;
                return expect(process.getCall(0).returnValue).to.be.rejectedWith(UnprocessableEntityError);
            });
        });

        describe('without entityType in request', () => {
            beforeEach(() => {
                req = {
                    params,
                    body: {
                        labelType
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
