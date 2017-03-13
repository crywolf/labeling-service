import {addLabel, testConfig} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import ReturnEntityLabelsExecutorSqlite from './ReturnEntityLabelsExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import {Database} from 'sqlite';

describe('ReturnEntityLabelsExecutorSqlite', () => {

    let executor: ReturnEntityLabelsExecutorSqlite;
    let db: Database;

    const entityAId = 2;
    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;

    const entityBId = 3;
    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;
    let entityBLabel4: Label;

    const entityCId = 6;
    let entityCLabel1: Label;
    let entityCLabel2: Label;

    let entityALabel3DifferentOwner: Label;

    beforeEach(() => {
        return initializetTest();
    });

    describe('#fetch', () => {
        describe('without label types and values parameters', () => {
            describe('for specific entity', () => {
                it('should return all labels of the entity', () => {
                    const ownerId = 1;

                    return executor.fetch(ownerId, entityAId)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(4);

                            const label1 = {type: entityALabel1.type, value: entityALabel1.value};
                            const label2 = {type: entityALabel2.type, value: entityALabel2.value};
                            const label3 = {type: entityALabel3.type, value: entityALabel3.value};
                            const label4 = {type: entityALabel4.type, value: entityALabel4.value};

                            expect(labels[0]).to.deep.equal(label1);
                            expect(labels[1]).to.deep.equal(label2);
                            expect(labels[2]).to.deep.equal(label3);
                            expect(labels[3]).to.deep.equal(label4);
                        });
                });

                it('should return all labels of the entity belonging to owner with different ID', () => {
                    const differentOwnerId = 99;

                    return executor.fetch(differentOwnerId, entityAId)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(1);

                            const label = {
                                type: entityALabel3DifferentOwner.type,
                                value: entityALabel3DifferentOwner.value
                            };
                            expect(labels[0]).to.deep.equal(label);
                        });
                });
            });

            describe('for another entity', () => {
                it('should return all labels of the entity', () => {
                    const ownerId = 1;

                    return executor.fetch(ownerId, entityBId)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(4);

                            const label1 = {type: entityBLabel1.type, value: entityBLabel1.value};
                            const label2 = {type: entityBLabel2.type, value: entityBLabel2.value};
                            const label3 = {type: entityBLabel3.type, value: entityBLabel3.value};
                            const label4 = {type: entityBLabel4.type, value: entityBLabel4.value};

                            expect(labels[0]).to.deep.equal(label1);
                            expect(labels[1]).to.deep.equal(label2);
                            expect(labels[2]).to.deep.equal(label3);
                            expect(labels[3]).to.deep.equal(label4);
                        });
                });
            });
        });

        describe('with label types', () => {
            describe('and no label values', () => {
                it('should return labels of specified entity with corresponding label types', () => {
                    const ownerId = 1;
                    const labelTypes = ['color', 'size', 'height'];

                    const params = {
                        labelTypes
                    };

                    return executor.fetch(ownerId, entityAId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(3);

                            const label1 = {type: entityALabel1.type, value: entityALabel1.value};
                            const label2 = {type: entityALabel2.type, value: entityALabel2.value};
                            const label3 = {type: entityALabel4.type, value: entityALabel4.value};

                            expect(labels[0]).to.deep.equal(label1);
                            expect(labels[1]).to.deep.equal(label2);
                            expect(labels[2]).to.deep.equal(label3);
                        });
                });
           });

            describe('and label values', () => {
                it('should return labels of specified entity with corresponding label types and label values', () => {
                    const ownerId = 1;
                    const labelTypes = ['color', 'size'];
                    const labelValues = ['black', 'big', 'small'];

                    const params = {
                        labelTypes,
                        labelValues
                    };

                    return executor.fetch(ownerId, entityAId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const label2 = {type: entityALabel2.type, value: entityALabel2.value};
                            const label4 = {type: entityALabel4.type, value: entityALabel4.value};

                            expect(labels[0]).to.deep.equal(label2);
                            expect(labels[1]).to.deep.equal(label4);
                        });
                });
            });
        });

        describe('with label values', () => {
            describe('and no label types', () => {
                it('should return labels of specified entity with corresponding label values', () => {
                    const ownerId = 1;
                    const labelValues = ['black', 'blue', 'red'];

                    const params = {
                        labelTypes: null,
                        labelValues
                    };

                    return executor.fetch(ownerId, entityAId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const label1 = {type: entityALabel1.type, value: entityALabel1.value};
                            const label2 = {type: entityALabel2.type, value: entityALabel2.value};

                            expect(labels[0]).to.deep.equal(label1);
                            expect(labels[1]).to.deep.equal(label2);
                        });
                });
           });
        });
    });

    function initializetTest () {
        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            })
            .then(insertLabels);
    }

    function insertLabels () {
        entityALabel1 = {
            ownerId: 1,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: 1,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityALabel3 = {
            ownerId: 1,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'someLabel',
            value: ''
        };
        entityALabel4 = {
            ownerId: 1,
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'size',
            value: 'big'
        };

        entityBLabel1 = {
            ownerId: 1,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: 1,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: 1,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'color',
            value: 'black'
        };
        entityBLabel4 = {
            ownerId: 1,
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'size',
            value: 'small'
        };

        entityCLabel1 = {
            ownerId: 1,
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'size',
            value: 'medium'
        };
        entityCLabel2 = {
            ownerId: 1,
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'shape',
            value: 'square'
        };

        entityALabel3DifferentOwner = {
            ownerId: 99,
            entityId: 2,
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };

        return addLabel(db, entityALabel1)
            .then(() => {
                return addLabel(db, entityALabel2);
            })
            .then(() => {
                return addLabel(db, entityALabel3);
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
                return addLabel(db, entityCLabel1);
            })
            .then(() => {
                return addLabel(db, entityCLabel2);
            })
            .then(() => {
                return addLabel(db, entityALabel4);
            })
            .then(() => {
                return addLabel(db, entityBLabel4);
            })
            .then(() => {
                return addLabel(db, entityALabel3DifferentOwner);
            });
    }

    function initializeExecutor (): Promise<ReturnEntityLabelsExecutorSqlite> {
        return storageService.init(testConfig.db)
            .then(() => {
                db = storageService.db;
                return new ReturnEntityLabelsExecutorSqlite(db);
            });
    }

});
