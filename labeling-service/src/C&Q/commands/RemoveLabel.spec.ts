import * as chai from 'chai';
import {expect} from 'chai';
import RemoveLabel from './RemoveLabel';
import {Command} from '../../coreEntities/Command';
import CommandExecutor from '../../coreEntities/CommandExecutor';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';

chai.use(chaiSinon);

describe('RemoveLabel command', () => {

    let command: Command;
    const executor: CommandExecutor = { execute: () => Promise.resolve() };

    let req: {params: any};
    const res = {};
    const next = sinon.stub();

    let process;
    let execute;

    beforeEach(() => {
        command = new RemoveLabel(executor);
        process = sinon.spy(command, 'process');
        execute = sinon.spy(executor, 'execute');
    });

    afterEach(() => {
        process.restore();
        execute.restore();
    });

    describe('#handler', () => {
        it('calls process() with request data', () => {
            req = { params: 'someRequestData' };
            command.handler(req, res, next);
            expect(process).to.be.calledOnce;
            expect(process).to.be.calledWith(req);
        });
    });

    describe('#process', () => {
        const ownerId = '002';
        const entityId = '0100';

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
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;
                expect(execute).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: []}
                );
            });
        });

        describe('with "labelTypes=someType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType';
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;
                expect(execute).to.be.calledWith(
                    ownerId, entityId, {labelTypes: ['someType'], labelValues: []}
                );
            });
        });

        describe('with "labelTypes=someType,anotherType"', () => {
            beforeEach(() => {
                req.params.labelTypes = 'someType,anotherType';
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;
                expect(execute).to.be.calledWith(
                    ownerId, entityId, {labelTypes: ['someType', 'anotherType'], labelValues: []}
                );
            });
        });

        describe('with "labelValues=someValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue';
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;
                expect(execute).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: ['someValue']}
                );
            });
        });

        describe('with "labelValues=someValue,anotherValue"', () => {
            beforeEach(() => {
                req.params.labelValues = 'someValue,anotherValue';
                command.handler(req, res, next);
            });

            it('calls execute() with correct parameters', () => {
                expect(execute).to.be.calledOnce;
                expect(execute).to.be.calledWith(
                    ownerId, entityId, {labelTypes: [], labelValues: ['someValue', 'anotherValue']}
                );
            });
        });
    });

});
