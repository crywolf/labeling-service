process.env.NODE_ENV = 'testing';

import Label from '../../coreEntities/Label';
import Restriction from '../../coreEntities/Restriction';
import SqlDatabase from '../../coreEntities/SqlDatabase';
import storageService from '../../lib/store/sqliteStorageService';
import config from '../../config';

const testConfig = {
    db: config.sqlite
};

function addLabel (db: SqlDatabase, label: Label): Promise<any> {
    const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];
    return db.run(`INSERT INTO ${testConfig.db.labelsTable} VALUES(NULL, ?, ?, ?, ?, ?)`, values);
}

function addRestriction (db: SqlDatabase, restriction: Restriction, hash): Promise<any> {
    const values = [restriction.ownerId, restriction.labelType, restriction.entityType, hash];
    return db.run(`INSERT INTO ${testConfig.db.restrictionsTable} VALUES(NULL, ?, ?, ?, ?)`, values);
}

function getAllLabels (db: SqlDatabase): Promise<any> {
    return db.all(`SELECT ownerId, entityId, entityType, type, value FROM ${testConfig.db.labelsTable} ORDER BY id`);
}

function getAllRestrictions (db: SqlDatabase): Promise<any> {
    return db.all(`SELECT ownerId, labelType, entityType FROM ${testConfig.db.restrictionsTable} ORDER BY id`);
}

function countRows (db: SqlDatabase, tablename: string): Promise<number> {
    return db.all(`SELECT COUNT(1) AS count FROM ${tablename}`)
        .then((row) => {
            return row[0].count;
        });
}

function initializeStorageService (): Promise<SqlDatabase> {
    return storageService.init(testConfig.db)
        .then(() => {
            return storageService.db;
        });
}

export {
    addLabel, addRestriction, getAllLabels, getAllRestrictions, countRows,
    initializeStorageService, testConfig
};
