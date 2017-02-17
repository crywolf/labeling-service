import {expect} from 'chai';
import CommandBuilder from './CommandBuilder';
import Command from './Command';
import memoryStorage from '../lib/store/memoryStorage';

describe('CommandBuilder', () => {
    let builder: CommandBuilder;

    beforeEach(() => {
        builder = new CommandBuilder(memoryStorage);
    });

    describe('#commands', () => {
        it('returns array of Command instances', () => {
            const commands = builder.commands;
            expect(commands).to.be.a('Array');
            commands.forEach((command) => {
                expect(command).to.be.instanceOf(Command);
            });
        });
    });
});
