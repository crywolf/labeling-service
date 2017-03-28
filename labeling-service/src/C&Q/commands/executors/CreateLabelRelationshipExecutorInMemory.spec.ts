import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import CreateLabelRelationshipExecutorInMemory from './CreateLabelRelationshipExecutorInMemory';

describe('CreateLabelRelationshipExecutorInMemory', () => {

    let executor: CreateLabelRelationshipExecutorInMemory;
    let memoryStorage: Set<Label>;
    let label1: Label;
    let label2: Label;
    let label3: Label;
    let label4: Label;

    beforeEach(() => {
        executor = initializeExecutor();

        label1 = {
            ownerId: '1',
            entityId: '2',
            entityType: 'SomeEntity',
            type: 'color',
            value: 'blue'
        };
        label2 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'SomeOtherEntity',
            type: 'height',
            value: '3'
        };
        label3 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'SomeOtherEntity',
            type: 'width',
            value: '6'
        };
        label4 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'SomeOtherEntity',
            type: 'color',
            value: 'black'
        };
    });

    describe('#execute', () => {
        describe('in case label is unique', () => {
            beforeEach(() => {
                memoryStorage.add(label1);
                return executor.execute(label2);
            });

            it('should attach label to entity', () => {
                expect(memoryStorage).to.be.a('Set');
                expect(memoryStorage.size).to.equal(2);
                const sIterator = memoryStorage.values();
                expect(sIterator.next().value).to.deep.equal(label1);
                expect(sIterator.next().value).to.deep.equal(label2);
            });
        });

        describe('in case label is not unique', () => {
            beforeEach(() => {
                memoryStorage.add(label1);
                memoryStorage.add(label2);
                return executor.execute(label1);
            });

            it('should not attach duplicate label to entity', () => {
                expect(memoryStorage).to.be.a('Set');
                expect(memoryStorage.size).to.equal(2);
            });
        });
    });

    function initializeExecutor (): CreateLabelRelationshipExecutorInMemory {
        memoryStorage = new Set();
        return new CreateLabelRelationshipExecutorInMemory(memoryStorage);
    }

});
