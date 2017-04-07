import {addLabel, initializeStorageService} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import ReturnEntityLabelsExecutorSql from './ReturnEntityLabelsExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';

describe('ReturnEntityLabelsExecutorSql', () => {

    let executor: ReturnEntityLabelsExecutorSql;
    let db: SqlDatabase;

    const entityAId = '002';
    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;

    const entityBId = '003';
    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;
    let entityBLabel4: Label;

    const entityCId = '006';
    let entityCLabel1: Label;
    let entityCLabel2: Label;

    let entityALabel3DifferentOwner: Label;

    beforeEach(() => {
        return initializeTest();
    });

    describe('#fetch', () => {
        context('without label types and values parameters', () => {
            context('for specific entity', () => {
                it('should return all labels of the entity', () => {
                    const ownerId = '001';

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
                    const differentOwnerId = '099';

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

            context('for another entity', () => {
                it('should return all labels of the entity', () => {
                    const ownerId = '001';

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

            context('in case of database error', () => {
                beforeEach(() => {
                    return initializeStorageService()
                        .then((sqlDb) => {
                            db = sqlDb;
                            sinon.stub(db, 'all').returns(Promise.reject(new Error('Some SQL error')));
                            return new ReturnEntityLabelsExecutorSql(db);
                        })
                        .then((sqlExecutor) => {
                            executor = sqlExecutor;
                        });
                });
                it('should reject with InternalServerError', () => {
                    const ownerId = '001';
                    return expect(executor.fetch(ownerId, entityBId)).to.be.rejectedWith(InternalServerError);
                });
            });
        });

        context('with label types', () => {
            context('and no label values', () => {
                it('should return labels of specified entity with corresponding label types', () => {
                    const ownerId = '001';
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

            context('and label values', () => {
                it('should return labels of specified entity with corresponding label types and label values', () => {
                    const ownerId = '001';
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

        context('with label values', () => {
            context('and no label types', () => {
                it('should return labels of specified entity with corresponding label values', () => {
                    const ownerId = '001';
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

    function initializeTest () {
        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            })
            .then(insertLabels);
    }

    function insertLabels () {
        entityALabel1 = {
            ownerId: '001',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: '001',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityALabel3 = {
            ownerId: '001',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'someLabel',
            value: ''
        };
        entityALabel4 = {
            ownerId: '001',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'size',
            value: 'big'
        };

        entityBLabel1 = {
            ownerId: '001',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: '001',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: '001',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'color',
            value: 'black'
        };
        entityBLabel4 = {
            ownerId: '001',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'size',
            value: 'small'
        };

        entityCLabel1 = {
            ownerId: '001',
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'size',
            value: 'medium'
        };
        entityCLabel2 = {
            ownerId: '001',
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'shape',
            value: 'square'
        };

        entityALabel3DifferentOwner = {
            ownerId: '099',
            entityId: '002',
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };

        return addLabel(db, entityALabel1)
            .then(() => addLabel(db, entityALabel2))
            .then(() => addLabel(db, entityALabel3))
            .then(() => addLabel(db, entityBLabel1))
            .then(() => addLabel(db, entityBLabel2))
            .then(() => addLabel(db, entityBLabel3))
            .then(() => addLabel(db, entityCLabel1))
            .then(() => addLabel(db, entityCLabel2))
            .then(() => addLabel(db, entityALabel4))
            .then(() => addLabel(db, entityBLabel4))
            .then(() => addLabel(db, entityALabel3DifferentOwner));
    }

    function initializeExecutor (): Promise<ReturnEntityLabelsExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new ReturnEntityLabelsExecutorSql(db);
            });
    }

});
