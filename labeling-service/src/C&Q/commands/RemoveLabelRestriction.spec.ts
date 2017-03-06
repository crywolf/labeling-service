import * as chai from 'chai';
import {expect} from 'chai';
import RemoveLabelRestriction from './RemoveLabelRestriction';
import {Command} from '../../coreEntities/Command';
import CommandExecutor from '../../coreEntities/CommandExecutor';
import * as sinon from 'sinon';
import * as chaiSinon from 'chai-sinon';

chai.use(chaiSinon);

describe('RemoveLabelRestriction command', () => {

    let command: Command;
    const executor: CommandExecutor = { execute: () => Promise.resolve() };

    let req: {params: any};
    const res = {};
    const next = sinon.stub();

    let process;
    let execute;

    beforeEach(() => {
        command = new RemoveLabelRestriction(executor);
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
        const valueHash = 'someHash';
        beforeEach(() => {
            req = {
                params: {
                    ownerId: '2',
                    valueHash
                }
            };
            command.handler(req, res, next);
        });

        it('calls execute() with correct parameters', () => {
            expect(execute).to.be.calledOnce;
            expect(execute).to.be.calledWith(2, valueHash);
        });
    });

});
