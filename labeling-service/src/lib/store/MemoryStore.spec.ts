import {expect} from 'chai';
import MemoryStore from './MemoryStore';
import Label from '../../coreEntities/Label';

describe('MemoryStore', () => {

    let store: MemoryStore;
    let memoryStorage: Set<Label>;
    let label1: Label;
    let label2: Label;
    let label3: Label;
    let label4: Label;

    beforeEach(() => {
        store = initializeStore();

        label1 = {
            ownerId: 1,
            entityId: 2,
            entityType: 'SomeEntity',
            type: 'color',
            value: 'blue'
        };
        label2 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'height',
            value: '3'
        };
        label3 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'width',
            value: '6'
        };
        label4 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'color',
            value: 'black'
        };
    });

    describe('#createLabelRelationship', () => {
        describe('in case label is unique', () => {
            beforeEach(() => {
                memoryStorage.add(label1);
                return store.createLabelRelationship(label2);
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
                return store.createLabelRelationship(label1);
            });

            it('should not attach duplicate label to entity', () => {
                expect(memoryStorage).to.be.a('Set');
                expect(memoryStorage.size).to.equal(2);
            });
        });

    });

    describe('#allEntitiesHavingLabel', () => {
        beforeEach(() => {
            memoryStorage.add(label1);
            memoryStorage.add(label2);
            memoryStorage.add(label3);
            memoryStorage.add(label4);
        });

        describe('without label types and values parameters', () => {
            it('should return all labeled entities', () => {
                const ownerId = 1;

                return store.allEntitiesHavingLabel(ownerId)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(4);
                        expect(labels[0]).to.deep.equal(label1);
                        expect(labels[1]).to.deep.equal(label2);
                        expect(labels[2]).to.deep.equal(label3);
                        expect(labels[3]).to.deep.equal(label4);
                    });
            });
        });

        describe('with label types', () => {
            it('should return labeled entities with corresponding label types', () => {
                const ownerId = 1;
                const labelTypes = ['color', 'height'];

                return store.allEntitiesHavingLabel(ownerId, labelTypes)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(3);
                        expect(labels[0]).to.deep.equal(label1);
                        expect(labels[1]).to.deep.equal(label2);
                        expect(labels[2]).to.deep.equal(label4);
                    });
            });
        });

        describe('with label types and entity types parameters', () => {
//            describe('', () => {
                it('should return labeled entities with corresponding label types and entity types', () => {
                    const ownerId = 1;
                    const labelTypes = ['color', 'height'];
                    const entityTypes = ['SomeOtherEntity'];

                    return store.allEntitiesHavingLabel(ownerId, labelTypes, entityTypes)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);
                            expect(labels[0]).to.deep.equal(label2);
                            expect(labels[1]).to.deep.equal(label4);
                        });
                });
            });
//        });
    });

    describe('#entityLabels', () => {
        beforeEach(() => {
/*            const label5: Label = {
                ownerId: 1,
                entityId: 3,
                entityType: 'SomeEntityWithNonUniqueId',
                type: 'color',
                value: 'white'
            };

            return executor.createLabelRelationship(label1)
                .then(() => executor.createLabelRelationship(label2))
                .then(() => executor.createLabelRelationship(label3))
                .then(() => executor.createLabelRelationship(label4));
//                .then(() => executor.createLabelRelationship(label5));
*/
            memoryStorage.add(label1);
            memoryStorage.add(label2);
            memoryStorage.add(label3);
            memoryStorage.add(label4);
        });

        describe('without label types and values parameters', () => {
            it('should return all labels of entity', () => {
                const ownerId = 1;
                const entityId = 3;

                return store.entityLabels(ownerId, entityId)
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
                const ownerId = 1;
                const entityId = 3;
                const labelTypes = ['color', 'height'];

                return store.entityLabels(ownerId, entityId, labelTypes)
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
                const ownerId = 1;
                const entityId = 3;
                const labelTypes = ['color', 'height'];
                const entityTypes = ['SomeOtherEntity'];

                return store.entityLabels(ownerId, entityId, labelTypes, entityTypes)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(2);
                        expect(labels[0]).to.deep.equal(label2);
                        expect(labels[1]).to.deep.equal(label4);
                    });
            });
        });

    });

    describe('#removeLabel without labelTypes and labelValues parameters', () => {
        let labelA: Label;
        let labelB: Label;
        let labelC: Label;

        beforeEach(() => {
            labelA = {
                ownerId: 1,
                entityId: 3,
                entityType: 'EntityA',
                type: 'color',
                value: 'black'
            };
            labelB = {
                ownerId: 1,
                entityId: 4,
                entityType: 'EntityB',
                type: 'height',
                value: '3'
            };
            labelC = {
                ownerId: 1,
                entityId: 3,
                entityType: 'EntityA',
                type: 'length',
                value: '5'
            };

            memoryStorage.add(labelA);
            memoryStorage.add(labelB);
            memoryStorage.add(labelC);
        });

        it('should return removed labels', () => {
            const entityId = 3;

            return store.removeLabel(entityId)
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(2);
                    expect(labels[0]).to.deep.equal(labelA);
                    expect(labels[1]).to.deep.equal(labelC);
                });
        });

        it('should remove all labels of entity', () => {
            const ownerId = 1;
            const entityId = 3;

            return store.removeLabel(entityId)
                .then(() => store.entityLabels(ownerId, entityId))
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(0);
                });
        });

        it('should let labels of other entities untouched', () => {
            const entityId = 3;
            const ownerId = 1;
            const otherEntityId = 4;

            return store.removeLabel(entityId)
                .then(() => store.entityLabels(ownerId, otherEntityId))
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(1);
                    expect(labels[0]).to.deep.equal(labelB);
                });
        });
    });

    function initializeStore (): MemoryStore {
        memoryStorage = new Set();
        return new MemoryStore(memoryStorage);
    }

});
