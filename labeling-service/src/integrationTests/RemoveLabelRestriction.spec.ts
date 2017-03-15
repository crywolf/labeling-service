import {initApp, request, expect} from '../lib/test/integration';
import {addRestriction, countRows, getAllRestrictions} from '../lib/test/util';
import Restriction from '../coreEntities/Restriction';
import storageService from '../lib/store/sqliteStorageService';
import SqlDatabase from '../coreEntities/SqlDatabase';

import config from '../config';
const testConfig = config.sqlite;

describe('Integration::RemoveLabelRestriction route', () => {

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
        context('without valueHash parameter', () => {
            it('should remove all restrictions for the owner and let restrictions of other owner untouched', () => {
                const removedEntitiesCount = 5;

                return request
                    .delete(`/owner/${ownerId}/label-restrictions/`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
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
        });

        context('with correct valueHash', () => {
            it('should remove restriction', () => {
                const valueHash = entityBRestriction1Hash;
                const removedEntitiesCount = 1;

                return request
                    .delete(`/owner/${ownerId}/label-restrictions/${valueHash}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
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
        });
    });

    function insertLabels () {
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
                return countRows(db, testConfig.restrictionsTable);
            })
            .then((count) => {
                storedEntitiesCount = count;
            });
    }

});
