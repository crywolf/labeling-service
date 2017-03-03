import {addRestriction, countRows, getAllRestrictions} from '../../../lib/test/util';
import {expect} from 'chai';
import Restriction from '../../../coreEntities/Restriction';
import RemoveLabelRestrictionExecutorSqlite from './RemoveLabelRestrictionExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import config from '../../../config';
import {Database} from 'sqlite';

describe('RemoveLabelRestrictionExecutorSqlite', () => {

    const testConfig = config.sqlite;
    testConfig.filename = ':memory:';

    let executor: RemoveLabelRestrictionExecutorSqlite;
    let db: Database;

    const ownerId = 10;
    const differentOwnerId = 99;

    let entityARestriction1: Restriction;
    const entityARestriction1Hash = 'entityARestriction1Hash';
    let entityARestriction2: Restriction;
    const entityARestriction2Hash = 'entityARestriction2Hash';
    let entityARestriction3: Restriction;
    const entityARestriction3Hash = 'entityARestriction3Hash';

    let entityBRestriction1: Restriction;
    const entityBRestriction1Hash = 'entityBRestriction1Hash';
    let entityBRestriction2: Restriction;
    const entityBRestriction2Hash = 'entityBRestriction2Hash';

    let entityADifferentOwnerRestriction1: Restriction;
    const entityADifferentOwnerRestriction1Hash = 'entityADifferentOwnerRestriction1Hash';

    let storedEntitiesCount: number;

    beforeEach(() => {
        entityARestriction1 = {
            ownerId,
            labelType: 'color',
            entityType: 'EntityA'
        };
        entityARestriction2 = {
            ownerId,
            labelType: 'length',
            entityType: 'EntityA'
        };
        entityARestriction3 = {
            ownerId,
            labelType: 'size',
            entityType: 'EntityA'
        };

        entityBRestriction1 = {
            ownerId,
            labelType: 'size',
            entityType: 'EntityB'
        };
        entityBRestriction2 = {
            ownerId,
            labelType: 'color',
            entityType: 'EntityB'
        };

        entityADifferentOwnerRestriction1 = {
            ownerId: differentOwnerId,
            labelType: 'color',
            entityType: 'EntityA'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    });

    describe('#execute', () => {

        beforeEach(() => {
            return addRestriction(db, entityARestriction1, entityARestriction1Hash)
                .then(() => {
                    return addRestriction(db, entityBRestriction1, entityBRestriction1Hash);
                })
                .then(() => {
                    return addRestriction(db, entityARestriction2, entityARestriction2Hash);
                })
                .then(() => {
                    return addRestriction(db, entityBRestriction2, entityBRestriction2Hash);
                })
                .then(() => {
                    return addRestriction(db, entityARestriction3, entityARestriction3Hash);
                })
                .then(() => {
                    return addRestriction(db, entityADifferentOwnerRestriction1, entityADifferentOwnerRestriction1Hash);
                })
                .then(() => {
                    return countRows(db, testConfig.restrictionsTable);
                })
                .then((count) => {
                    storedEntitiesCount = count;
                });
        });

        describe('without valueHash', () => {
            beforeEach(() => {
                return executor.execute(ownerId);
            });

            it('should remove all restrictions for the owner and let restrictions of other owner untouched', () => {
                const removedEntitiesCount = 5;
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    })
                    .then(() => getAllRestrictions(db))
                    .then((restrictions) => {
                        expect(restrictions[0]).to.deep.equal(entityADifferentOwnerRestriction1);
                    });
            });
        });

        describe('with correct valueHash', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityBRestriction1Hash);
            });

            it(`should remove restriction`, () => {
                const removedEntitiesCount = 1;
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    })
                    .then(() => getAllRestrictions(db))
                    .then((restrictions) => {
                        expect(restrictions[0]).to.deep.equal(entityARestriction1);
                        expect(restrictions[1]).to.deep.equal(entityARestriction2);
                        expect(restrictions[2]).to.deep.equal(entityBRestriction2);
                        expect(restrictions[3]).to.deep.equal(entityARestriction3);
                        expect(restrictions[4]).to.deep.equal(entityADifferentOwnerRestriction1);
                    });
            });
        });

        describe('with valueHash of the restriction for the other user', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityADifferentOwnerRestriction1Hash);
            });

            it(`should not remove anything`, () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount);
                    });
            });
        });

    });

    function initializeExecutor (): Promise<RemoveLabelRestrictionExecutorSqlite> {
        return storageService.init(testConfig)
            .then(() => {
                db = storageService.db;
                return new RemoveLabelRestrictionExecutorSqlite(db);
            });
    }

});
