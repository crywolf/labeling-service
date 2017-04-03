import {addLabel, initializeStorageService} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import ReturnAllLabeledEntitiesExecutorSql from './ReturnAllLabeledEntitiesExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';

describe('ReturnAllLabeledEntitiesExecutorSql', () => {

    let executor: ReturnAllLabeledEntitiesExecutorSql;
    let db: SqlDatabase;

    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;

    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;
    let entityBLabel4: Label;
    let entityBLabel5: Label;

    let entityCLabel1: Label;
    let entityCLabel2: Label;

    let entityALabel3DifferentOwner: Label;

    beforeEach(() => {
        return initializeTest();
    });

    describe('#fetch', () => {
        context('without label types and entity types parameters', () => {
            it('should return all labeled entities of a corresponding owner', () => {
                const ownerId = '001';

                return executor.fetch(ownerId)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(3);

                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                        const entityC = {entityId: entityCLabel1.entityId, entityType: entityCLabel1.entityType};

                        expect(labels[0]).to.deep.equal(entityA);
                        expect(labels[1]).to.deep.equal(entityB);
                        expect(labels[2]).to.deep.equal(entityC);
                    });
            });

            it('should return all labeled entities of a corresponding owner with different ID', () => {
                const differentOwnerId = '099';

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

            context('in case of database error', () => {
                beforeEach(() => {
                    return initializeStorageService()
                        .then((sqlDb) => {
                            db = sqlDb;
                            sinon.stub(db, 'all').returns(Promise.reject(new Error('Some SQL error')));
                            return new ReturnAllLabeledEntitiesExecutorSql(db);
                        })
                        .then((sqlExecutor) => {
                            executor = sqlExecutor;
                        });
                });
                it('should reject with InternalServerError', () => {
                    const ownerId = '001';
                    return expect(executor.fetch(ownerId)).to.be.rejectedWith(InternalServerError);
                });
            });
        });

        context('with label types', () => {
            context('and OR condition', () => {
                it('should return labeled entities with corresponding label types', () => {
                    const ownerId = '001';
                    const labelTypes = ['color', 'height'];

                    const params = {
                        labelTypes,
                        typesOperator: 'OR'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityA);
                            expect(labels[1]).to.deep.equal(entityB);
                        });
                });
            });

            context('and AND condition', () => {
                it('should return labeled entities with corresponding label types', () => {
                    const ownerId = '001';
                    const labelTypes = ['color', 'height'];

                    const params = {
                        labelTypes,
                        typesOperator: 'AND'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(1);

                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityB);
                        });
                });
            });
        });

        context('with label values', () => {
            context('and OR condition', () => {
                it('should return labeled entities with corresponding label values', () => {
                    const ownerId = '001';
                    const labelValues = ['blue', 'white'];

                    const params = {
                        labelValues,
                        valuesOperator: 'OR'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityA);
                            expect(labels[1]).to.deep.equal(entityB);
                        });
                });
            });
        });

        context('with label values', () => {
            context('and AND condition', () => {
                it('should return labeled entities with corresponding label values', () => {
                    const ownerId = '001';
                    const labelValues = ['blue', 'black'];

                    const params = {
                        labelValues,
                        valuesOperator: 'AND'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(1);

                            const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityA);
                        });
                });
            });
        });

        context('with label type and label values', () => {
            context('joined with OR condition', () => {
                it('should return labeled entities with corresponding label type and label values', () => {
                    const ownerId = '001';
                    const labelTypes = ['size'];
                    const labelValues = ['small', 'medium'];

                    const params = {
                        labelTypes,
                        labelValues,
                        typesOperator: 'OR'
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            const entityC = {entityId: entityCLabel1.entityId, entityType: entityCLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityB);
                            expect(labels[1]).to.deep.equal(entityC);
                        });
                });
            });
        });

        context('with', () => {
            context('one label type and entity type param', () => {
                it('should return labeled entities with corresponding label type and entity type', () => {
                    const ownerId = '001';
                    const labelTypes = ['color'];
                    const entityTypes = ['EntityB'];

                    return executor.fetch(ownerId, {labelTypes, entityTypes})
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(1);

                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityB);
                        });
                });
            });

            context('more label types joined with OR condition and more entity types', () => {
                it('should return labeled entities with corresponding label types and entity types', () => {
                    const ownerId = '001';
                    const labelTypes = ['color', 'someNonexistentLabel'];
                    const entityTypes = ['EntityB', 'EntityA', 'EntityC'];

                    const params = {
                        labelTypes,
                        typesOperator: 'OR',
                        entityTypes
                    };

                    return executor.fetch(ownerId, params)
                    .then((labels) => {
                        expect(labels).to.be.a('Array');
                        expect(labels).to.have.lengthOf(2);

                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                        expect(labels[0]).to.deep.equal(entityA);
                        expect(labels[1]).to.deep.equal(entityB);
                    });
                });
            });

            context('more label types joined with AND condition and more entity types', () => {
                context('if no entity of required types with all required labels does not exist', () => {
                    it('should not return anything', () => {
                        const ownerId = '001';
                        const labelTypes = ['color', 'shape'];
                        const entityTypes = ['EntityB', 'EntityA', 'EntityC'];

                        const params = {
                            labelTypes,
                            typesOperator: 'AND',
                            entityTypes
                        };

                        return executor.fetch(ownerId, params)
                            .then((labels) => {
                                expect(labels).to.be.a('Array');
                                expect(labels).to.have.lengthOf(0);
                            });
                    });
                });
            });

            context('if entity of one the required types with all required labels exists', () => {
                it('should return that entity', () => {
                    const ownerId = '001';
                    const labelTypes = ['color', 'height'];
                    const entityTypes = ['EntityB', 'EntityA', 'EntityC'];

                    const params = {
                        labelTypes,
                        typesOperator: 'AND',
                        entityTypes
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(1);

                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                            expect(labels[0]).to.deep.equal(entityB);
                        });
                });
            });

            context('if entities of required types with all required labels exists', () => {
                it('should return those entities', () => {
                    const ownerId = '001';
                    const labelTypes = ['color', 'size'];
                    const entityTypes = ['EntityB', 'EntityA', 'EntityC'];

                    const params = {
                        labelTypes,
                        typesOperator: 'AND',
                        entityTypes
                    };

                    return executor.fetch(ownerId, params)
                        .then((labels) => {
                            expect(labels).to.be.a('Array');
                            expect(labels).to.have.lengthOf(2);

                            const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                            const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};

                            expect(labels[0]).to.deep.equal(entityA);
                            expect(labels[1]).to.deep.equal(entityB);
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
            entityId: '002',
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: '001',
            entityId: '002',
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityALabel3 = {
            ownerId: '001',
            entityId: '002',
            entityType: 'EntityA',
            type: 'someLabel',
            value: ''
        };
        entityALabel4 = {
            ownerId: '001',
            entityId: '002',
            entityType: 'EntityA',
            type: 'size',
            value: 'big'
        };

        entityBLabel1 = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityB',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityB',
            type: 'color',
            value: 'black'
        };
        entityBLabel4 = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityB',
            type: 'size',
            value: 'small'
        };
        entityBLabel5 = {
            ownerId: '001',
            entityId: '003',
            entityType: 'EntityB',
            type: 'color',
            value: 'white'
        };

        entityCLabel1 = {
            ownerId: '001',
            entityId: '006',
            entityType: 'EntityC',
            type: 'size',
            value: 'medium'
        };
        entityCLabel2 = {
            ownerId: '001',
            entityId: '006',
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
                return addLabel(db, entityBLabel5);
            })
            .then(() => {
                return addLabel(db, entityALabel3DifferentOwner);
            });
    }

    function initializeExecutor (): Promise<ReturnAllLabeledEntitiesExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new ReturnAllLabeledEntitiesExecutorSql(db);
            });
    }

});
