import {initApp, request, expect, storageService} from '../lib/test/integration';
import {addLabel, countRows, getAllLabels, testConfig} from '../lib/test/util';
import Label from '../coreEntities/Label';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::RemoveLabel route', () => {

    let db: SqlDatabase;

    const entityAId = '003';
    const entityBId = '004';
    const ownerId = '0010';
    const differentOwnerId = '0099';

    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;
    let entityALabel5: Label;

    let entityBLabel1: Label;
    let entityBLabel2: Label;

    let entityADifferentOwnerLabel1: Label;

    let storedEntitiesCount: number;

    before(() => {
        return initApp()
            .then(() => {
                db = storageService.db;
            });
    });

    beforeEach(() => {
         return storageService.truncate()
            .then(() => {
                return insertLabels();
            });
    });

    describe('calling the route', () => {
        context('without any querystring parameters', () => {
            it('should remove all labels of entity and leave labels of other entities untouched', () => {
                const removedEntitiesCount = 5;

                return request
                    .delete(`/owners/${ownerId}/labeled-entities/${entityAId}/labels`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                            })
                            .then(() => getAllLabels(db))
                            .then((labels) => {
                                expect(labels[0]).to.deep.equal(entityBLabel1);
                                expect(labels[1]).to.deep.equal(entityBLabel2);
                            });
                    });
            });
        });

        context('with complex querystring', () => {
            it('should remove labels of specified entity with corresponding label types and label values', () => {
                const querystring = '?labelTypes=color,size&labelValues=black,red';
                const removedEntitiesCount = 2;

                return request
                    .delete(`/owners/${ownerId}/labeled-entities/${entityAId}/labels${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                            })
                            .then(() => getAllLabels(db))
                            .then((labels) => {
                                expect(labels[0]).to.deep.equal(entityBLabel1);
                                expect(labels[1]).to.deep.equal(entityALabel2);
                                expect(labels[2]).to.deep.equal(entityBLabel2);
                                expect(labels[3]).to.deep.equal(entityALabel4);
                            });
                    });
            });
        });
    });

    function insertLabels () {
        entityALabel1 = {
            ownerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityBLabel1 = {
            ownerId,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityALabel2 = {
            ownerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'length',
            value: '5'
        };
        entityBLabel2 = {
            ownerId,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'color',
            value: 'white'
        };
        entityALabel3 = {
            ownerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'red'
        };
        entityALabel4 = {
            ownerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel5 = {
            ownerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'height',
            value: '6'
        };

        entityADifferentOwnerLabel1 = {
            ownerId: differentOwnerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };

        return addLabel(db, entityALabel1)
            .then(() => {
                return addLabel(db, entityBLabel1);
            })
            .then(() => {
                return addLabel(db, entityALabel2);
            })
            .then(() => {
                return addLabel(db, entityBLabel2);
            })
            .then(() => {
                return addLabel(db, entityALabel3);
            })
            .then(() => {
                return addLabel(db, entityALabel4);
            })
            .then(() => {
                return addLabel(db, entityALabel5);
            })
            .then(() => {
                return addLabel(db, entityADifferentOwnerLabel1);
            })
            .then(() => {
                return countRows(db, testConfig.db.labelsTable);
            })
            .then((count) => {
                storedEntitiesCount = count;
            });
    }

});
