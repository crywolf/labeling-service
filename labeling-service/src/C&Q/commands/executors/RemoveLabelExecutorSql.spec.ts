import {addLabel, countRows, getAllLabels, testConfig, initializeStorageService} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import RemoveLabelExecutorSql from './RemoveLabelExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';

describe('RemoveLabelExecutorSql', () => {

    let executor: RemoveLabelExecutorSql;
    let db: SqlDatabase;

    const entityAId = 3;
    const entityBId = 4;
    const ownerId = 10;
    const differentOwnerId = 99;

    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;
    let entityALabel5: Label;

    let entityBLabel1: Label;
    let entityBLabel2: Label;

    let entityADifferentOwnerLabel1: Label;

    let storedEntitiesCount: number;

    beforeEach(() => {
        return initializeTest();
    });

    describe('#execute', () => {

        context('without labelTypes and labelValues parameters', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityAId);
            });

            it('should remove all labels of entity and leave labels of other entities untouched', () => {
                const removedEntitiesCount = 5;
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

        context('without labelTypes and labelValues parameters and different ownerId', () => {
            beforeEach(() => {
                return executor.execute(differentOwnerId, entityAId);
            });

            it(`should remove all labels of the entity belonging to that different owner`, () => {
                const removedEntitiesCount = 1;
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    });
            });
        });

        context('with labelTypes parameters', () => {
            beforeEach(() => {
                const labelTypes = ['color', 'height'];
                const params = {
                    labelTypes
                };
                return executor.execute(ownerId, entityAId, params);
            });

            it('should remove only labels of that types', () => {
                const removedEntitiesCount = 4;
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    })
                    .then(() => getAllLabels(db))
                    .then((labels) => {
                        expect(labels[0]).to.deep.equal(entityBLabel1);
                        expect(labels[1]).to.deep.equal(entityALabel2);
                        expect(labels[2]).to.deep.equal(entityBLabel2);
                    });
            });
        });

        context('with labelValues parameters', () => {
            beforeEach(() => {
                const labelValues = ['black', 'red', '6'];
                const params = {
                    labelValues
                };
                return executor.execute(ownerId, entityAId, params);
            });

            it('should remove only labels of that values', () => {
                const removedEntitiesCount = 3;
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
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

        context('with labelTypes and labelValues parameters', () => {
            beforeEach(() => {
                const labelTypes = ['color'];
                const labelValues = ['black', 'red'];
                const params = {
                    labelTypes,
                    labelValues
                };
                return executor.execute(ownerId, entityAId, params);
            });

            it('should remove only labels of that types and values', () => {
                const removedEntitiesCount = 2;
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
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

        context('in case of database error', () => {
            beforeEach(() => {
                return initializeStorageService()
                    .then((sqlDb) => {
                        db = sqlDb;
                        sinon.stub(db, 'run').returns(Promise.reject(new Error('Some SQL error')));
                        return new RemoveLabelExecutorSql(db);
                    })
                    .then((sqlExecutor) => {
                        executor = sqlExecutor;
                    });
            });
            it('should reject InternalServerError', () => {
                return expect(executor.execute(ownerId, entityAId)).to.be.rejectedWith(InternalServerError);
            });
        });

    });

    function initializeTest () {
        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            })
            .then(insertLabels);
    }

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

    function initializeExecutor (): Promise<RemoveLabelExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new RemoveLabelExecutorSql(db);
            });
    }

});
