import {expect} from 'chai';
import Label from '../../../coreEntities/Label';
import CreateLabelRelationshipExecutorSqlite from './CreateLabelRelationshipExecutorSqlite';
import storageService from '../../../lib/store/sqliteStorageService';
import config from '../../../config';
import {Database} from 'sqlite';

describe('CreateLabelRelationshipExecutorSqlite', () => {

    const testConfig = config.sqlite;
    let executor: CreateLabelRelationshipExecutorSqlite;
    let db: Database;
    let label1: Label;
    let label2: Label;
    let label3: Label;
    let label4: Label;

    beforeEach(() => {
        label1 = {
            ownerId: 1,
            entityId: 2,
            entityType: 'SomeEntity',
            type: 'color',
            value: 'blue'
        };
        label2 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'height',
            value: '3'
        };
        label3 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'width',
            value: '6'
        };
        label4 = {
            ownerId: 1,
            entityId: 3,
            entityType: 'SomeOtherEntity',
            type: 'color',
            value: 'black'
        };

        return initializeExecutor()
            .then((sqlExecutor) => {
                executor = sqlExecutor;
            });
    });

    describe('#execute', () => {
        describe('in case label is unique', () => {
            beforeEach(() => {
                return addLabel(label1)
                    .then(() => {
                        return executor.execute(label2);
                    });
            });

            it('should attach label to entity', () => {
                return countRows()
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });

            });
        });

        describe('in case label is not unique', () => {
            beforeEach(() => {
                return addLabel(label1)
                    .then(() => {
                        return addLabel(label2);
                    })
                    .then(() => {
                        return executor.execute(label1);
                    });
            });

            it('should not attach duplicate label to entity', () => {
                return countRows()
                    .then((count) => {
                        return expect(count).to.equal(2);
                    });
            });
        });
    });

    function initializeExecutor (): Promise<CreateLabelRelationshipExecutorSqlite> {
        testConfig.filename = ':memory:';
        return storageService.init(testConfig)
            .then(() => {
                db = storageService.db;
                return new CreateLabelRelationshipExecutorSqlite(db);
            });
    }

    function addLabel (label: Label): Promise<any> {
        const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];
        return db.run(`INSERT INTO ${testConfig.tablename} VALUES(NULL, ?, ?, ?, ?, ?)`, values);
    }

    function countRows (): Promise<number> {
        return db.get(`SELECT COUNT(1) AS count FROM ${testConfig.tablename}`)
            .then((row) => {
                return row.count;
            });
    }
});
