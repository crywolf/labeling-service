import {
    addLabel, addRestriction, countRows, getAllLabels, testConfig, initializeStorageService
} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import Restriction from '../../../coreEntities/Restriction';
import CreateLabelRelationshipExecutorSql from './CreateLabelRelationshipExecutorSql';
import SqlDatabase from '../../../coreEntities/SqlDatabase';
import * as sinon from 'sinon';
import InternalServerError from '../../../coreEntities/InternalServerError';
import UnprocessableEntityError from '../../../coreEntities/UnprocessableEntityError';

describe('CreateLabelRelationshipExecutorSql', () => {

    let executor: CreateLabelRelationshipExecutorSql;
    let db: SqlDatabase;

    let entityA200Label1: Label;
    let entityA200Label2: Label;
    let entityA200Label3: Label;
    let entityA200Label1DifferentOwner: Label;

    let entityB200Label: Label;
    let entityA210Label: Label;
    let entityB300label: Label;

    let entityARestriction1: Restriction;
    let entityARestriction2: Restriction;
    let entityARestriction3: Restriction;

    let entityBRestriction1: Restriction;
    const whateverHash = '35r2f7e59b5b4716a88ca5c4ddc07ooe';

    beforeEach(() => {
        return initializeTest();
    });

    describe('#execute (trying to add new label to entity)', () => {

        context('in case entityType and entityId is unique', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return executor.execute(entityB300label);
                    });
            });

            it('should attach label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case entityType is different and entityId is the same', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return executor.execute(entityB200Label);
                    });
            });

            it('should attach label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case entityType is the same and entityId is different', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return executor.execute(entityA210Label);
                    });
            });

            it('should attach label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case label is completely the same (not unique)', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return addLabel(db, entityB300label);
                    })
                    .then(() => {
                        return executor.execute(entityA200Label1);
                    });
            });

            it('should not attach duplicate label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case only label value is different', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return executor.execute(entityA200Label2);
                    });
            });

            it('should attach label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case label is the same but different owner', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1)
                    .then(() => {
                        return executor.execute(entityA200Label1DifferentOwner);
                    });
            });

            it('should attach label to entity', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });

        context('in case label value is missing', () => {
            let labelWithoutValue: Label;

            beforeEach(() => {
                labelWithoutValue = {
                    ownerId: '001',
                    entityId: '068',
                    entityType: 'someEntity',
                    type: 'color'
                };

                return executor.execute(labelWithoutValue);
            });

            it('should attach label to entity with labelValue set to null', () => {
                return countRows(db, testConfig.db.labelsTable)
                    .then((count) => {
                        return expect(count).to.equal(1);
                    })
                    .then(() => getAllLabels(db))
                    .then((labels) => {
                        expect(labels[0]).to.deep.equal({
                            ownerId: labelWithoutValue.ownerId,
                            entityId: labelWithoutValue.entityId,
                            entityType: labelWithoutValue.entityType,
                            type: labelWithoutValue.type,
                            value: null
                        });
                    });
            });

            describe('and trying to add the same label', () => {
                it('should not attach duplicate label to entity', () => {
                    return executor.execute(labelWithoutValue)
                        .then(() => {
                            return countRows(db, testConfig.db.labelsTable);
                        })
                        .then((count) => {
                            return expect(count).to.equal(1);
                        });
                });
            });
        });

        context('in case of database error', () => {
            beforeEach(() => {
                return initializeStorageService()
                    .then((sqlDb) => {
                        db = sqlDb;
                        sinon.stub(db, 'run').returns(Promise.reject(new Error('Some SQL error')));
                        return new CreateLabelRelationshipExecutorSql(db);
                    })
                    .then((sqlExecutor) => {
                        executor = sqlExecutor;
                    });
            });
            it('should reject with InternalServerError', () => {
                return expect(executor.execute(entityA200Label1)).to.be.rejectedWith(InternalServerError);
            });
        });

        context('in case restriction exists', () => {
            context('on the same labelType and unspecified entityType', () => {
                beforeEach(() => {
                    return addRestriction(db, entityARestriction1, whateverHash);
                });

                it('should reject with UnprocessableEntityError', () => {
                    return expect(executor.execute(entityA200Label3)).to.be.rejectedWith(UnprocessableEntityError);
                });
            });

            context('on the same labelType and entityType', () => {
                beforeEach(() => {
                    return addRestriction(db, entityARestriction2, whateverHash);
                });

                it('should reject with UnprocessableEntityError', () => {
                    return expect(executor.execute(entityA200Label3)).to.be.rejectedWith(UnprocessableEntityError);
                });
            });

            context('on the same labelType and different entityType', () => {
                beforeEach(() => {
                    return addRestriction(db, entityBRestriction1, whateverHash);
                });

                it('should attach label to entity', () => {
                    return executor.execute(entityA200Label3)
                        .then(() => {
                            return countRows(db, testConfig.db.labelsTable);
                        })
                        .then((count) => {
                            return expect(count).to.equal(1);
                        });

                });
            });

            context('on the same entityType and different labelType', () => {
                beforeEach(() => {
                    return addRestriction(db, entityARestriction3, whateverHash);
                });

                it('should attach label to entity', () => {
                    return executor.execute(entityA200Label3)
                        .then(() => {
                            return countRows(db, testConfig.db.labelsTable);
                        })
                        .then((count) => {
                            return expect(count).to.equal(1);
                        });

                });
            });
        });

    });

    function initializeTest () {
        entityA200Label1 = {
            ownerId: '001',
            entityId: '0200',
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };
        entityA200Label2 = {
            ownerId: '001',
            entityId: '0200',
            entityType: 'entityA',
            type: 'color',
            value: 'red'
        };
        entityA200Label3 = {
            ownerId: '001',
            entityId: '0200',
            entityType: 'entityA',
            type: 'size',
            value: 'small'
        };

        entityA200Label1DifferentOwner = {
            ownerId: '099',
            entityId: '0200',
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };

        entityA210Label = {
            ownerId: '001',
            entityId: '0210',
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };

        entityB200Label = {
            ownerId: '001',
            entityId: '0200',
            entityType: 'entityB',
            type: 'color',
            value: 'blue'
        };
        entityB300label = {
            ownerId: '001',
            entityId: '0300',
            entityType: 'entityB',
            type: 'color',
            value: 'blue'
        };

        entityARestriction1 = {
            ownerId: '001',
            labelType: 'size'
        };
        entityARestriction2 = {
            ownerId: '001',
            labelType: 'size',
            entityType: 'entityA'
        };

        entityARestriction3 = {
            ownerId: '001',
            labelType: 'height',
            entityType: 'entityA'
        };

        entityBRestriction1 = {
            ownerId: '001',
            labelType: 'size',
            entityType: 'entityB'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    }

    function initializeExecutor (): Promise<CreateLabelRelationshipExecutorSql> {
        return initializeStorageService()
            .then((sqlDb) => {
                db = sqlDb;
                return new CreateLabelRelationshipExecutorSql(db);
            });
    }

});
