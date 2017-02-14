import {expect} from 'chai';
import MemoryStore from './MemoryStore';
import Label from '../../coreEntities/Label';

describe('MemoryStore', () => {

    let store: MemoryStore;
    let label: Label;
    let label2: Label;

    beforeEach(() => {
        store = new MemoryStore();

        label = {
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

    });

    describe('#createLabelRelationship', () => {
        beforeEach(() => {
            return store.createLabelRelationship(label);
        });

        it('should attach label to entity', () => {
            const ownerId = 1;
            const entityId = 2;

            return store.entityLabels(ownerId, entityId)
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(1);
                    expect(labels[0]).to.deep.equal(label);
                });
        });
    });

    describe('#allEntitiesHavingLabel', () => {
        beforeEach(() => {
            return store.createLabelRelationship(label)
                .then(() => store.createLabelRelationship(label2));
        });

        it('should return all labeled entities', () => {
            const ownerId = 1;

            return store.allEntitiesHavingLabel(ownerId)
                .then((labels) => {
                    expect(labels).to.be.a('Array');
                    expect(labels).to.have.lengthOf(2);
                    expect(labels[0]).to.deep.equal(label);
                    expect(labels[1]).to.deep.equal(label2);
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

            return store.createLabelRelationship(labelA)
                .then(() => store.createLabelRelationship(labelB))
                .then(() => store.createLabelRelationship(labelC));
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

});
