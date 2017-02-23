import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import AllEntitiesHavingLabelExecutorSqlite from './AllEntitiesHavingLabelExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import config from '../../../config';
import {Database} from 'sqlite';
import {addLabel} from '../../../lib/test/util';

describe.only('AllEntitiesHavingLabelExecutorSqlite', () => {

    const testConfig = config.sqlite;
    let executor: AllEntitiesHavingLabelExecutorSqlite;
    let db: Database;

    let entityALabel1: Label;
    let entityALabel2: Label;

    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;

    let entityALabel3DifferentOwner: Label;

    beforeEach(() => {
        entityALabel1 = {
            ownerId: 1,
            entityId: 2,
            entityType: 'SomeEntity',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: 1,
            entityId: 2,
            entityType: 'SomeEntity',
            type: 'color',
            value: 'black'
        };

        entityBLabel1 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'color',
            value: 'black'
        };

        entityALabel3DifferentOwner = {
            ownerId: 99,
            entityId: 2,
            entityType: 'SomeEntity',
            type: 'color',
            value: 'black'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    });

    describe('#fetch', () => {
        beforeEach(() => {
            return addLabel(db, entityALabel1)
                .then(() => {
                    return addLabel(db, entityALabel1);
                })
                .then(() => {
                    return addLabel(db, entityALabel2);
                })
                .then(() => {
                    return addLabel(db, entityBLabel1);
                })
                .then(() => {
                    return addLabel(db, entityBLabel2);
                })
                .then(() => {
                    return addLabel(db, entityBLabel3);
                })
                .then(() => {
                    return addLabel(db, entityALabel3DifferentOwner);
                });
        });

        describe('without label types and values parameters', () => {
            it('should return all labeled entities of a corresponding owner', () => {
                const ownerId = 1;

                return executor.fetch(ownerId)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(2);
                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        expect(labels[0]).to.deep.equal(entityA);
                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                        expect(labels[1]).to.deep.equal(entityB);
                    });
            });

            it('should return all labeled entities of a corresponding owner with different ID', () => {
                const differentOwnerId = 99;

                return executor.fetch(differentOwnerId)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(1);
                        const entityA = {
                            entityId: entityALabel3DifferentOwner.entityId,
                            entityType: entityALabel3DifferentOwner.entityType
                        };
                        expect(labels[0]).to.deep.equal(entityA);
                    });
            });

        });

        describe('with label types', () => {
            describe('and OR condition', () => {
                it('should return labeled entities with corresponding label types', () => {
                    const ownerId = 1;
                    const labelTypes = ['color', 'height'];

                    const params = {
                        labelTypes,
                        labelOperator: 'OR'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);
                            const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityA);
                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[1]).to.deep.equal(entityB);
                        });
                });
            });

            describe('and AND condition', () => {
                it('should return labeled entities with corresponding label types', () => {
                    const ownerId = 1;
                    const labelTypes = ['color', 'height', 'width'];

                    const params = {
                        labelTypes,
                        labelOperator: 'AND'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');

//console.log('///LABELS:', labels)
                            expect(labels).to.have.lengthOf(1);
                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityB);
                        });
                });
            });
        });

        describe('with label types and entity types parameters', () => {
//            describe('', () => {
            it('should return labeled entities with corresponding label types and entity types', () => {
                const ownerId = 1;
                const labelTypes = ['color'];
                const entityTypes = ['SomeEntity'];

                return executor.fetch(ownerId, {labelTypes, entityTypes})
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(1);
                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        expect(labels[0]).to.deep.equal(entityA);
                    });
            });
        });
//        });
    });

    function initializeExecutor (): Promise<AllEntitiesHavingLabelExecutorSqlite> {
        testConfig.filename = ':memory:';
        return storageService.init(testConfig)
            .then(() => {
                db = storageService.db;
                return new AllEntitiesHavingLabelExecutorSqlite(db);
            });
    }

});
