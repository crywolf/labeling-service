import {addLabel, countRows, getAllLabels, testConfig} from '../../../lib/test/util';
import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import CreateLabelRelationshipExecutorSql from './CreateLabelRelationshipExecutorSql';
import storageService from '../../../lib/store/sqliteStorageService';
import SqlDatabase from '../../../coreEntities/SqlDatabase';

describe('CreateLabelRelationshipExecutorSql', () => {

    let executor: CreateLabelRelationshipExecutorSql;
    let db: SqlDatabase;

    let entityA200Label1: Label;
    let entityA200Label2: Label;
    let entityA200Label1DifferentOwner: Label;

    let entityB200Label: Label;
    let entityA210Label: Label;
    let entityB300label: Label;

    beforeEach(() => {
        return initializeTest();
    });

    describe('#execute (trying to add new label to entity)', () => {

        describe('in case entityType and entityId is unique', () => {
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

        describe('in case entityType is different and entityId is the same', () => {
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

        describe('in case entityType is the same and entityId is different', () => {
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

        describe('in case label is completely the same (not unique)', () => {
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

        describe('in case only label value is different', () => {
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

        describe('in case label is the same but different owner', () => {
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

        describe('in case label value is missing', () => {
            let labelWithoutValue: Label;

            beforeEach(() => {
                labelWithoutValue = {
                    ownerId: 1,
                    entityId: 68,
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

    });

    function initializeTest () {
        entityA200Label1 = {
            ownerId: 1,
            entityId: 200,
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };
        entityA200Label2 = {
            ownerId: 1,
            entityId: 200,
            entityType: 'entityA',
            type: 'color',
            value: 'red'
        };

        entityA200Label1DifferentOwner = {
            ownerId: 99,
            entityId: 200,
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };

        entityA210Label = {
            ownerId: 1,
            entityId: 210,
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };

        entityB200Label = {
            ownerId: 1,
            entityId: 200,
            entityType: 'entityB',
            type: 'color',
            value: 'blue'
        };
        entityB300label = {
            ownerId: 1,
            entityId: 300,
            entityType: 'entityB',
            type: 'color',
            value: 'blue'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    }

    function initializeExecutor (): Promise<CreateLabelRelationshipExecutorSql> {
        return storageService.init(testConfig.db)
            .then(() => {
                db = storageService.db;
                return new CreateLabelRelationshipExecutorSql(db);
            });
    }

});
