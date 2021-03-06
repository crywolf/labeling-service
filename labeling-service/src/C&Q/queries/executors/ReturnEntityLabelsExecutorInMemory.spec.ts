import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import ReturnEntityLabelsExecutorInMemory from './ReturnEntityLabelsExecutorInMemory';

describe('ReturnEntityLabelsExecutorInMemory', () => {

    let executor: ReturnEntityLabelsExecutorInMemory;
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

    describe('#fetch', () => {
        beforeEach(() => {
            memoryStorage.add(label1);
            memoryStorage.add(label2);
            memoryStorage.add(label3);
            memoryStorage.add(label4);
        });

        describe('without label types and values parameters', () => {
            it('should return all labels of entity', () => {
                const ownerId = '1';
                const entityId = '3';

                return executor.fetch(ownerId, entityId)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(3);
                        expect(labels[0]).to.deep.equal(label2);
                        expect(labels[1]).to.deep.equal(label3);
                        expect(labels[2]).to.deep.equal(label4);
                    });
            });
        });

        describe('with label types', () => {
            it('should return labels with corresponding label types', () => {
                const ownerId = '1';
                const entityId = '3';
                const labelTypes = ['color', 'height'];

                return executor.fetch(ownerId, entityId, {labelTypes})
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(2);
                        expect(labels[0]).to.deep.equal(label2);
                        expect(labels[1]).to.deep.equal(label4);
                    });
            });
        });

        describe('with label types and entity types parameters', () => {
            it('should return labels with corresponding label types and entity types', () => {
                const ownerId = '1';
                const entityId = '3';
                const labelTypes = ['color', 'height'];
                const entityTypes = ['SomeOtherEntity'];

                return executor.fetch(ownerId, entityId, {labelTypes, entityTypes})
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(2);
                        expect(labels[0]).to.deep.equal(label2);
                        expect(labels[1]).to.deep.equal(label4);
                    });
            });
        });
    });

    function initializeExecutor (): ReturnEntityLabelsExecutorInMemory {
        memoryStorage = new Set();
        return new ReturnEntityLabelsExecutorInMemory(memoryStorage);
    }

});
