import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import RemoveLabelExecutorInMemory from './RemoveLabelExecutorInMemory';

describe('RemoveLabelExecutorInMemory', () => {

    let executor: RemoveLabelExecutorInMemory;
    let memoryStorage: Set<Label>;

    let labelA: Label;
    let labelB: Label;
    let labelC: Label;
    let labelD: Label;
    let labelE: Label;
    let labelF: Label;
    let storedEntitiesCount: number;

    beforeEach(() => {
        executor = initializeExecutor();

        labelA = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        labelB = {
            ownerId: '001',
            entityId: '004',
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        labelC = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityA',
            type: 'length',
            value: '5'
        };
        labelD = {
            ownerId: '001',
            entityId: '004',
            entityType: 'EntityB',
            type: 'color',
            value: 'white'
        };
        labelE = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityA',
            type: 'color',
            value: 'red'
        };
        labelF = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
    });

    describe('#execute', () => {

        beforeEach(() => {
            memoryStorage.add(labelA);
            memoryStorage.add(labelB);
            memoryStorage.add(labelC);
            memoryStorage.add(labelD);
            memoryStorage.add(labelE);
            memoryStorage.add(labelF);
            storedEntitiesCount = memoryStorage.size;
        });

        it('should return removed labels', () => {
            const entityId = '003';

            return executor.execute(entityId)
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(4);
                    expect(labels[0]).to.deep.equal(labelA);
                    expect(labels[1]).to.deep.equal(labelC);
                    expect(labels[2]).to.deep.equal(labelE);
                });
        });

        describe('without labelTypes and labelValues parameters', () => {
            beforeEach(() => {
                const entityId = '003';
                return executor.execute(entityId);
            });

            it('should remove all labels of entity and leave labels of other entities untouched', () => {
                expect(memoryStorage).to.be.a('Set');
                const removedEntitiesCount = 4;
                expect(memoryStorage.size).to.equal(storedEntitiesCount - removedEntitiesCount);

                const sIterator = memoryStorage.values();
                expect(sIterator.next().value).to.deep.equal(labelB);
                expect(sIterator.next().value).to.deep.equal(labelD);
            });
        });

        describe('with labelTypes parameters', () => {
            beforeEach(() => {
                const entityId = '003';
                const labelTypes = ['color'];
                return executor.execute(entityId, labelTypes);
            });

            it('should remove only labels of that types', () => {
                const removedEntitiesCount = 3;
                expect(memoryStorage.size).to.equal(storedEntitiesCount - removedEntitiesCount);

                const sIterator = memoryStorage.values();
                expect(sIterator.next().value).to.deep.equal(labelB);
                expect(sIterator.next().value).to.deep.equal(labelC);
                expect(sIterator.next().value).to.deep.equal(labelD);
            });
        });

        describe('with labelTypes and labelValues parameters', () => {
            beforeEach(() => {
                const entityId = '003';
                const labelTypes = ['color'];
                const labelValues = ['black', 'red'];
                return executor.execute(entityId, labelTypes, labelValues);
            });

            it('should remove only labels of that types and values', () => {
                const removedEntitiesCount = 2;
                expect(memoryStorage.size).to.equal(storedEntitiesCount - removedEntitiesCount);

                const sIterator = memoryStorage.values();
                expect(sIterator.next().value).to.deep.equal(labelB);
                expect(sIterator.next().value).to.deep.equal(labelC);
                expect(sIterator.next().value).to.deep.equal(labelD);
                expect(sIterator.next().value).to.deep.equal(labelF);
            });
        });

    });

    function initializeExecutor (): RemoveLabelExecutorInMemory {
        memoryStorage = new Set();
        return new RemoveLabelExecutorInMemory(memoryStorage);
    }

});
