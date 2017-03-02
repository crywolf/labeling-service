import {addRestriction, countRows} from '../../../lib/test/util';
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
                        return expect(count).to.equal(2);
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
                        return expect(count).to.equal(2);
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

            it('should attach label to entity', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
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

            it('should not attach duplicate label to entity', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
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

            it('should attach label to entity', () => {
                return countRows(db, testConfig.restrictionsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
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
