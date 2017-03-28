import {addRestriction, initializeStorageService} from '../../../lib/test/util';
import {expect} from 'chai';
import Restriction from '../../../coreEntities/Restriction';
import ReturnAllLabelRestrictionsExecutorSql from './ReturnAllLabelRestrictionsExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';

describe('ReturnAllLabelRestrictionsExecutorSql', () => {

    let executor: ReturnAllLabelRestrictionsExecutorSql;
    let db: SqlDatabase;

    const whateverHash = '56d2f7e59b5b4716a88ca5c4ddc0791d';

    const ownerId = '010';
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

    const differentOwnerId = '099';
    let entityARestriction3DifferentOwner: Restriction;

    beforeEach(() => {
        return initializeTest();
    });

    describe('#fetch', () => {
        context('without any parameters', () => {
            context('for specified owner', () => {
                it('should return all restrictions for the specified owner', () => {
                    return executor.fetch(ownerId)
                        .then((restrictions) => {
                            expect(restrictions).to.be.a('Array');
                            expect(restrictions).to.have.lengthOf(10);

                            const restriction1 = {
                                hashValue: whateverHash,
                                labelType: entityARestriction1.labelType,
                                entityType: entityARestriction1.entityType
                            };
                            const restriction2 = {
                                hashValue: whateverHash,
                                labelType: entityARestriction2.labelType,
                                entityType: entityARestriction2.entityType
                            };
                            const restriction3 = {
                                hashValue: whateverHash,
                                labelType: entityARestriction3.labelType,
                                entityType: entityARestriction3.entityType
                            };
                            const restriction4 = {
                                hashValue: whateverHash,
                                labelType: entityBRestriction1.labelType,
                                entityType: entityBRestriction1.entityType
                            };
                            const restriction5 = {
                                hashValue: whateverHash,
                                labelType: entityBRestriction2.labelType,
                                entityType: entityBRestriction2.entityType
                            };
                            const restriction6 = {
                                hashValue: whateverHash,
                                labelType: entityBRestriction3.labelType,
                                entityType: entityBRestriction3.entityType
                            };
                            const restriction7 = {
                                hashValue: whateverHash,
                                labelType: entityCRestriction1.labelType,
                                entityType: entityCRestriction1.entityType
                            };
                            const restriction8 = {
                                hashValue: whateverHash,
                                labelType: entityCRestriction2.labelType,
                                entityType: entityCRestriction2.entityType
                            };
                            const restriction9 = {
                                hashValue: whateverHash,
                                labelType: entityARestriction4.labelType,
                                entityType: entityARestriction4.entityType
                            };
                            const restriction10 = {
                                hashValue: whateverHash,
                                labelType: entityBRestriction4.labelType,
                                entityType: entityBRestriction4.entityType
                            };

                            expect(restrictions[0]).to.deep.equal(restriction1);
                            expect(restrictions[1]).to.deep.equal(restriction2);
                            expect(restrictions[2]).to.deep.equal(restriction3);
                            expect(restrictions[3]).to.deep.equal(restriction4);
                            expect(restrictions[4]).to.deep.equal(restriction5);
                            expect(restrictions[5]).to.deep.equal(restriction6);
                            expect(restrictions[6]).to.deep.equal(restriction7);
                            expect(restrictions[7]).to.deep.equal(restriction8);
                            expect(restrictions[8]).to.deep.equal(restriction9);
                            expect(restrictions[9]).to.deep.equal(restriction10);
                        });
                });
            });

            context('for another owner', () => {
                it('should return all restrictions for that owner', () => {

                    return executor.fetch(differentOwnerId)
                        .then((restrictions) => {
                            expect(restrictions).to.be.a('Array');
                            expect(restrictions).to.have.lengthOf(1);

                            const restriction1 = {
                                hashValue: whateverHash,
                                labelType: entityARestriction3DifferentOwner.labelType,
                                entityType: entityARestriction3DifferentOwner.entityType
                            };

                            expect(restrictions[0]).to.deep.equal(restriction1);
                        });
                });
            });

            context('in case of database error', () => {
                beforeEach(() => {
                    return initializeStorageService()
                        .then((sqlDb) => {
                            db = sqlDb;
                            sinon.stub(db, 'all').returns(Promise.reject(new Error('Some SQL error')));
                            return new ReturnAllLabelRestrictionsExecutorSql(db);
                        })
                        .then((sqlExecutor) => {
                            executor = sqlExecutor;
                        });
                });
                it('should reject with InternalServerError', () => {
                    return expect(executor.fetch(ownerId)).to.be.rejectedWith(InternalServerError);
                });
            });
        });

        context('with specified entity type parameter', () => {
            it('should return all restrictions only for specified entity type', () => {
                const entityTypes = ['EntityC'];

                const params = {
                    entityTypes
                };

                return executor.fetch(ownerId, params)
                    .then((restrictions) => {
                        expect(restrictions).to.be.a('Array');
                        expect(restrictions).to.have.lengthOf(2);

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

                        expect(restrictions[0]).to.deep.equal(restriction1);
                        expect(restrictions[1]).to.deep.equal(restriction2);
                });
            });
        });

        context('with specified more entity types parameters', () => {
            it('should return all restrictions for all specified entity types', () => {
                const entityTypes = ['EntityC', 'EntityB'];

                const params = {
                    entityTypes
                };

                return executor.fetch(ownerId, params)
                    .then((restrictions) => {
                        expect(restrictions).to.be.a('Array');
                        expect(restrictions).to.have.lengthOf(6);

                        const restriction1 = {
                            hashValue: whateverHash,
                            labelType: entityBRestriction1.labelType,
                            entityType: entityBRestriction1.entityType
                        };
                        const restriction2 = {
                            hashValue: whateverHash,
                            labelType: entityBRestriction2.labelType,
                            entityType: entityBRestriction2.entityType
                        };
                        const restriction3 = {
                            hashValue: whateverHash,
                            labelType: entityBRestriction3.labelType,
                            entityType: entityBRestriction3.entityType
                        };
                        const restriction4 = {
                            hashValue: whateverHash,
                            labelType: entityCRestriction1.labelType,
                            entityType: entityCRestriction1.entityType
                        };
                        const restriction5 = {
                            hashValue: whateverHash,
                            labelType: entityCRestriction2.labelType,
                            entityType: entityCRestriction2.entityType
                        };
                        const restriction6 = {
                            hashValue: whateverHash,
                            labelType: entityBRestriction4.labelType,
                            entityType: entityBRestriction4.entityType
                        };

                        expect(restrictions[0]).to.deep.equal(restriction1);
                        expect(restrictions[1]).to.deep.equal(restriction2);
                        expect(restrictions[2]).to.deep.equal(restriction3);
                        expect(restrictions[3]).to.deep.equal(restriction4);
                        expect(restrictions[4]).to.deep.equal(restriction5);
                        expect(restrictions[5]).to.deep.equal(restriction6);
                    });
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

    function initializeExecutor (): Promise<ReturnAllLabelRestrictionsExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new ReturnAllLabelRestrictionsExecutorSql(db);
            });
    }

});
