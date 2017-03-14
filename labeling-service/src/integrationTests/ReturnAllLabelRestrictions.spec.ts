import {initApp, request, expect} from '../lib/test/integration';
import {addRestriction} from '../lib/test/util';
import Restriction from '../coreEntities/Restriction';
import storageService from '../lib/store/sqliteStorageService';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::ReturnAllLabelRestrictions route', () => {

    let db: SqlDatabase;

    const whateverHash = '56d2f7e59b5b4716a88ca5c4ddc0791d';

    const ownerId = 10;
    let entityARestriction1: Restriction;
    let entityARestriction2: Restriction;
    let entityARestriction3: Restriction;
    let entityARestriction4: Restriction;

    let entityBRestriction1: Restriction;
    let entityBRestriction2: Restriction;
    let entityBRestriction3: Restriction;
    let entityBRestriction4: Restriction;

    let entityCRestriction1: Restriction;
    let entityCRestriction2: Restriction;

    const differentOwnerId = 99;
    let entityARestriction3DifferentOwner: Restriction;

    before(() => {
        return initApp()
            .then(() => {
                db = storageService.db;
            });
    });

    beforeEach(() => {
        return storageService.truncate()
            .then(() => {
                return insertRestrictions();
            });
    });

    describe('calling the route', () => {
        describe('without any querystring parameters', () => {
            it('should return all restrictions for the specified owner', () => {
                return request
                    .get(`/owner/${ownerId}/label-restrictions`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(10);
                        expect(body[0]).to.deep.equal(
                            {
                                hashValue: whateverHash,
                                labelType: entityARestriction1.labelType,
                                entityType: entityARestriction1.entityType
                            }
                        );
                    });
            });
        });

        describe('with specified entityType query parameter', () => {
            it('should return all restrictions only for specified entity type', () => {
                const querystring = '?entityTypes=EntityC';
                return request
                    .get(`/owner/${ownerId}/label-restrictions${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(2);

                        const restriction1 = {
                            hashValue: whateverHash,
                            labelType: entityCRestriction1.labelType,
                            entityType: entityCRestriction1.entityType
                        };
                        const restriction2 = {
                            hashValue: whateverHash,
                            labelType: entityCRestriction2.labelType,
                            entityType: entityCRestriction2.entityType
                        };

                        expect(body[0]).to.deep.equal(restriction1);
                        expect(body[1]).to.deep.equal(restriction2);
                    });
            });

        });

    });

    function insertRestrictions () {
        entityARestriction1 = {
            ownerId,
            labelType: 'color',
            entityType: 'EntityA'
        };
        entityARestriction2 = {
            ownerId,
            labelType: 'producer',
            entityType: 'EntityA'
        };
        entityARestriction3 = {
            ownerId,
            labelType: 'someLabel',
            entityType: 'EntityA'
        };
        entityARestriction4 = {
            ownerId,
            labelType: 'size',
            entityType: 'EntityA'
        };

        entityBRestriction1 = {
            ownerId,
            labelType: 'height',
            entityType: 'EntityB'
        };
        entityBRestriction2 = {
            ownerId,
            labelType: 'width',
            entityType: 'EntityB'
        };
        entityBRestriction3 = {
            ownerId,
            labelType: 'color',
            entityType: 'EntityB'
        };
        entityBRestriction4 = {
            ownerId,
            labelType: 'size',
            entityType: 'EntityB'
        };

        entityCRestriction1 = {
            ownerId,
            entityType: 'EntityC',
            labelType: 'size'
        };
        entityCRestriction2 = {
            ownerId,
            labelType: 'shape',
            entityType: 'EntityC'
        };

        entityARestriction3DifferentOwner = {
            ownerId: differentOwnerId,
            labelType: 'color',
            entityType: 'EntityA'
        };

        return addRestriction(db, entityARestriction1, whateverHash)
            .then(() => {
                return addRestriction(db, entityARestriction2, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityARestriction3, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityBRestriction1, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityBRestriction2, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityBRestriction3, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityCRestriction1, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityCRestriction2, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityARestriction4, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityBRestriction4, whateverHash);
            })
            .then(() => {
                return addRestriction(db, entityARestriction3DifferentOwner, whateverHash);
            });
    }

});
