import {addLabel, countRows, getAllLabels} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import RemoveLabelExecutorSqlite from './RemoveLabelExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import config from '../../../config';
import {Database} from 'sqlite';

describe('RemoveLabelExecutorSqlite', () => {

    const testConfig = config.sqlite;
    let executor: RemoveLabelExecutorSqlite;
    let db: Database;

    const entityAId = 3;
    const entityBId = 4;
    const ownerId = 10;
    const diffenrentOwnerId = 99;

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
            ownerId: diffenrentOwnerId,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    });

    describe('#execute', () => {

        beforeEach(() => {
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
                    return countRows(db);
                })
                .then((count) => {
                    storedEntitiesCount = count;
                });
        });

        describe('without labelTypes and labelValues parameters', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityAId);
            });

            it('should remove all labels of entity and let labels of other entities untouched', () => {
                const removedEntitiesCount = 5;
                return countRows(db)
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

        describe('without labelTypes and labelValues parameters and different ownerId', () => {
            beforeEach(() => {
                return executor.execute(diffenrentOwnerId, entityAId);
            });

            it(`should remove all labels of the entity belonging to that different owner`, () => {
                const removedEntitiesCount = 1;
                return countRows(db)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    });
            });
        });

        describe('with labelTypes parameters', () => {
            beforeEach(() => {
                const labelTypes = ['color', 'height'];
                const params = {
                    labelTypes
                };
                return executor.execute(ownerId, entityAId, params);
            });

            it('should remove only labels of that types', () => {
                const removedEntitiesCount = 4;
                return countRows(db)
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

        describe('with labelValues parameters', () => {
            beforeEach(() => {
                const labelValues = ['black', 'red', '6'];
                const params = {
                    labelValues
                };
                return executor.execute(ownerId, entityAId, params);
            });

            it('should remove only labels of that values', () => {
                const removedEntitiesCount = 3;
                return countRows(db)
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

        describe('with labelTypes and labelValues parameters', () => {
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
                return countRows(db)
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

    });

    function initializeExecutor (): Promise<RemoveLabelExecutorSqlite> {
        testConfig.filename = ':memory:';
        return storageService.init(testConfig)
            .then(() => {
                db = storageService.db;
                return new RemoveLabelExecutorSqlite(db);
            });
    }

});
