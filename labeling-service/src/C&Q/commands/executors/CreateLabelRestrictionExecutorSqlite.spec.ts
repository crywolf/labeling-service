import {addRestriction, countRows, getAllRestrictions} from '../../../lib/test/util';
import {expect} from 'chai';
import Restriction from '../../../coreEntities/Restriction';
import CreateLabelRestrictionExecutorSqlite from './CreateLabelRestrictionExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import config from '../../../config';
import {Database} from 'sqlite';

describe('CreateLabelRestrictionExecutorSqlite', () => {

    const testConfig = config.sqlite;
    testConfig.filename = ':memory:';

    let executor: CreateLabelRestrictionExecutorSqlite;
    let db: Database;

    let entityARestriction1: Restriction;
    const whateverHash = '56d2f7e59b5b4716a88ca5c4ddc0791d';

    let entityARestriction2: Restriction;
    let entityARestriction1DifferentOwner: Restriction;

    let entityBRestriction1: Restriction;

    beforeEach(() => {
        entityARestriction1 = {
            ownerId: 1,
            labelType: 'color',
            entityType: 'entityA'
        };
        entityARestriction2 = {
            ownerId: 1,
            labelType: 'producer',
            entityType: 'entityA'
        };

        entityARestriction1DifferentOwner = {
            ownerId: 99,
            labelType: 'color',
            entityType: 'entityA'
        };

        entityBRestriction1 = {
            ownerId: 1,
            labelType: 'color',
            entityType: 'entityB'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    });

    describe('#execute (trying to add new restriction)', () => {
        describe('in case labelType and entityType is unique', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash)
                    .then(() => {
                        return executor.execute(entityBRestriction1);
                    });
            });

            it('should add restriction', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(2);
                    });
            });
        });

        describe('in case entityType is different and labelType is the same', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash)
                    .then(() => {
                        return executor.execute(entityBRestriction1);
                    });
            });

            it('should add restriction', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(2);
                    });
            });
        });

        describe('in case entityType is the same and labelType is different', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash)
                    .then(() => {
                        return executor.execute(entityARestriction2);
                    });
            });

            it('should add restriction', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(2);
                    });
            });
        });

        describe('in case entityType is missing', () => {
            let restrictionWithoutEntityType: Restriction;

            beforeEach(() => {
                restrictionWithoutEntityType = {
                    ownerId: 1,
                    labelType: 'color'
                };

                return executor.execute(restrictionWithoutEntityType);
            });

            it('should add restriction wit entityType set to null', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(1);
                    })
                    .then(() => getAllRestrictions(db))
                    .then((restrictions) => {
                        expect(restrictions[0]).to.deep.equal({
                            ownerId: restrictionWithoutEntityType.ownerId,
                            labelType: restrictionWithoutEntityType.labelType,
                            entityType: null
                        });
                    });
            });

            describe('and trying to add the same restriction', () => {
                it('should not add duplicate restriction', () => {
                    return executor.execute(restrictionWithoutEntityType)
                        .then(() => {
                            return countRows(db, testConfig.restrictionsTable);
                        })
                        .then((count) => {
                            expect(count).to.equal(1);
                        });
                });
            });
        });

        describe('in case restriction is completely the same (not unique)', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash)
                    .then(() => {
                        return addRestriction(db, entityBRestriction1, whateverHash);
                    })
                    .then(() => {
                        return executor.execute(entityARestriction1);
                    });
            });

            it('should not add duplicate restriction', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(2);
                    });
            });
        });

        describe('in case restriction is the same but different owner', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash)
                    .then(() => {
                        return executor.execute(entityARestriction1DifferentOwner);
                    });
            });

            it('should add restriction', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        expect(count).to.equal(2);
                    });
            });
        });

    });

    function initializeExecutor (): Promise<CreateLabelRestrictionExecutorSqlite> {
        return storageService.init(testConfig)
            .then(() => {
                db = storageService.db;
                return new CreateLabelRestrictionExecutorSqlite(db);
            });
    }

});
