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
    let entityA200Label4: Label;
    let entityA200Label1DifferentOwner: Label;

    let entityB200Label: Label;
    let entityA210Label: Label;
    let entityB300Label: Label;
    let entityB300Label2: Label;

    let restriction1: Restriction;
    let restriction2: Restriction;
    let restriction1ForDifferentOwner: Restriction;
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
                        return executor.execute(entityB300Label);
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
                        return addLabel(db, entityB300Label);
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

        // RESTRICTIONS
        context('in case restriction exists', () => {
            context('with labelType and unspecified entityType', () => {
                beforeEach(() => {
                    // labelType: 'size'
                    return addRestriction(db, restriction1, whateverHash);
                });

                context('and new label is of that type', () => {
                    beforeEach(() => {
                        // entityType: 'entityA'
                        // type: 'size'
                        return executor.execute(entityA200Label3);
                    });
                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });

                context('and new label is not of corresponding type', () => {
                    it('should reject with UnprocessableEntityError', () => {
                        // entityType: 'entityA'
                        // type: 'color'
                        return expect(executor.execute(entityA200Label1)).to.be.rejectedWith(UnprocessableEntityError);
                    });
                });
            });

            context('with labelType and entityType', () => {
                beforeEach(() => {
                    // labelType: 'size',
                    // entityType: 'entityA'
                    return addRestriction(db, entityARestriction1, whateverHash);
                });

                context('and new label is of different type but the same entityType', () => {
                    it('should reject with UnprocessableEntityError', () => {
                        // entityType: 'entityA',
                        // type: 'color',
                        return expect(executor.execute(entityA200Label1)).to.be.rejectedWith(UnprocessableEntityError);
                    });
                });

                context('and new label is of the same type and the same entityType', () => {
                    beforeEach(() => {
                        // entityType: 'entityA'
                        // type: 'size',
                        return executor.execute(entityA200Label3);
                    });
                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });
            });

            context('with the same labelType and different entityType', () => {
                beforeEach(() => {
                    // labelType: 'size'
                    // entityType: 'entityB'
                    return addRestriction(db, entityBRestriction1, whateverHash);
                });

                it('should attach label to entity', () => {
                    // entityType: 'entityA'
                    // type: 'size'
                    return executor.execute(entityA200Label3)
                        .then(() => {
                            return countRows(db, testConfig.db.labelsTable);
                        })
                        .then((count) => {
                            return expect(count).to.equal(1);
                        });
                });
            });

            context('with the same entityType and different labelType', () => {
                beforeEach(() => {
                    // labelType: 'height'
                    // entityType: 'entityA'
                    return addRestriction(db, entityARestriction2, whateverHash);
                });

                it('should reject with UnprocessableEntityError', () => {
                    // entityType: 'entityA'
                    // type: 'size'
                    return expect(executor.execute(entityA200Label3)).to.be.rejectedWith(UnprocessableEntityError);
                });
            });

            context('with labelType and unspecified entityType - but for different user! -', () => {
                beforeEach(() => {
                    // ownerId: '099'
                    // labelType: 'size'
                    return addRestriction(db, restriction1ForDifferentOwner, whateverHash);
                });

                context('and new label is of that type', () => {
                    beforeEach(() => {
                        // ownerId: '001'
                        // entityType: 'entityA'
                        // type: 'size'
                        return executor.execute(entityA200Label3);
                    });
                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });

                context('and new label is not of corresponding type', () => {
                    beforeEach(() => {
                        // ownerId: '001'
                        // entityType: 'entityA'
                        // type: 'color'
                        return executor.execute(entityA200Label1);
                    });

                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });

            });
        });

        // More restrictions
        context('in case more restrictions exist:', () => {
            context('one with labelType="size" and unspecified entityType ' +
                'and another with labelType="height" and entityType="entityA"', () => {
                beforeEach(() => {
                    return addRestriction(db, restriction1, whateverHash)
                        .then(() => addRestriction(db, entityARestriction2, whateverHash));
                });

                context('and new label is of type="size" and entityType="entityB"', () => {
                    beforeEach(() => {
                        return executor.execute(entityB300Label2);
                    });
                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });

                context('and new label is of type="height" and entityType="entityA"', () => {
                    beforeEach(() => {
                        return executor.execute(entityA200Label4);
                    });
                    it('should attach label to entity', () => {
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                return expect(count).to.equal(1);
                            });
                    });
                });

                context('and new label is of type="size" and entityType="entityA"', () => {
                    it('should reject with UnprocessableEntityError', () => {
                        return expect(executor.execute(entityA200Label3)).to.be.rejectedWith(UnprocessableEntityError);
                    });
                });

                context('and new label is of type="color" and entityType="entityA"', () => {
                    it('should reject with UnprocessableEntityError', () => {
                        return expect(executor.execute(entityA210Label)).to.be.rejectedWith(UnprocessableEntityError);
                    });
                });
            });
        });

        context('in case much more restrictions exist', () => {
            beforeEach(() => {
                        // type: 'size'
                return addRestriction(db, restriction1, whateverHash)
                        // ownerId: '099'
                    .then(() => addRestriction(db, restriction1ForDifferentOwner, whateverHash))
                        // labelType: 'size', entityType: 'entityB'
                    .then(() => addRestriction(db, entityBRestriction1, whateverHash))
                        // labelType: 'producer'
                    .then(() => addRestriction(db, restriction2, whateverHash))
                        // labelType: 'height', entityType: 'entityA'
                    .then(() => addRestriction(db, entityARestriction2, whateverHash))
                        // labelType: 'length', entityType: 'entityA'
                    .then(() => addRestriction(db, entityARestriction3, whateverHash));
            });

            context('first fulfilled restriction', () => {
                beforeEach(() => {
                    // entityType: 'entityA', type: 'height'
                    return executor.execute(entityA200Label4);
                });
                it('should allow to attach label to entity', () => {
                    return countRows(db, testConfig.db.labelsTable)
                        .then((count) => {
                            return expect(count).to.equal(1);
                        });
                });
            });

            context('when none of them is fulfilled', () => {
                it('should reject with UnprocessableEntityError', () => {
                    // entityType: 'entityA', type: 'size'
                    return expect(executor.execute(entityA200Label3)).to.be.rejectedWith(UnprocessableEntityError);
                });
            });

            context('when adding restriction that allows to add the label', () => {
                beforeEach(() => {
                    // labelType: 'size', entityType: 'entityA';
                    return addRestriction(db, entityARestriction1, whateverHash);
                });
                it('should attach label to entity', () => {
                    // type: 'size', entityType: 'entityA'
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
        entityA200Label4 = {
            ownerId: '001',
            entityId: '0200',
            entityType: 'entityA',
            type: 'height',
            value: 'tall'
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
        entityB300Label = {
            ownerId: '001',
            entityId: '0300',
            entityType: 'entityB',
            type: 'color',
            value: 'blue'
        };
        entityB300Label2 = {
            ownerId: '001',
            entityId: '0300',
            entityType: 'entityB',
            type: 'size',
            value: 'huge'
        };

        restriction1 = {
            ownerId: '001',
            labelType: 'size'
        };
        restriction2 = {
            ownerId: '001',
            labelType: 'producer'
        };
        restriction1ForDifferentOwner = {
            ownerId: '099',
            labelType: 'size'
        };

        entityARestriction1 = {
            ownerId: '001',
            labelType: 'size',
            entityType: 'entityA'
        };
        entityARestriction2 = {
            ownerId: '001',
            labelType: 'height',
            entityType: 'entityA'
        };
        entityARestriction3 = {
            ownerId: '001',
            labelType: 'length',
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
