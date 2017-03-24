import {
    addRestriction, countRows, getAllRestrictions, testConfig,
    initializeStorageService
} from '../../../lib/test/util';
import {expect} from 'chai';
import Restriction from '../../../coreEntities/Restriction';
import RemoveLabelRestrictionExecutorSql from './RemoveLabelRestrictionExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';

describe('RemoveLabelRestrictionExecutorSql', () => {

    let executor: RemoveLabelRestrictionExecutorSql;
    let db: SqlDatabase;

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
        return initializeTest();
    });

    describe('#execute', () => {

        context('without valueHash', () => {
            beforeEach(() => {
                return executor.execute(ownerId);
            });

            it('should remove all restrictions for the owner and leave restrictions of other owner untouched', () => {
                const removedEntitiesCount = 5;
                return countRows(db, testConfig.db.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount - removedEntitiesCount);
                    })
                    .then(() => getAllRestrictions(db))
                    .then((restrictions) => {
                        expect(restrictions[0]).to.deep.equal(entityADifferentOwnerRestriction1);
                    });
            });
        });

        context('with correct valueHash', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityBRestriction1Hash);
            });

            it(`should remove restriction`, () => {
                const removedEntitiesCount = 1;
                return countRows(db, testConfig.db.restrictionsTable)
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

        context('with valueHash of the restriction for the other user', () => {
            beforeEach(() => {
                return executor.execute(ownerId, entityADifferentOwnerRestriction1Hash);
            });

            it(`should not remove anything`, () => {
                return countRows(db, testConfig.db.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(storedEntitiesCount);
                    });
            });
        });

        context('in case of database error', () => {
            beforeEach(() => {
                return initializeStorageService()
                    .then((sqlDb) => {
                        db = sqlDb;
                        sinon.stub(db, 'run').returns(Promise.reject(new Error('Some SQL error')));
                        return new RemoveLabelRestrictionExecutorSql(db);
                    })
                    .then((sqlExecutor) => {
                        executor = sqlExecutor;
                    });
            });
            it('should reject with InternalServerError', () => {
                return expect(executor.execute(ownerId, entityARestriction1Hash))
                    .to.be.rejectedWith(InternalServerError);
            });
        });

    });

    function initializeTest () {
        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            })
            .then(insertRestrictions);
    }

    function insertRestrictions () {
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
                return countRows(db, testConfig.db.restrictionsTable);
            })
            .then((count) => {
                storedEntitiesCount = count;
            });
    }

    function initializeExecutor (): Promise<RemoveLabelRestrictionExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new RemoveLabelRestrictionExecutorSql(db);
            });
    }

});
