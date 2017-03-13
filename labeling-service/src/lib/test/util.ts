process.env.NODE_ENV = 'test';

import Label from '../../coreEntities/Label';
import Restriction from '../../coreEntities/Restriction';
import {Database} from 'sqlite';
import config from '../../config';

const testConfig = {
    db: config.sqlite
};

testConfig.db.filename = ':memory:';

function addLabel (db: Database, label: Label): Promise<any> {
    const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];
    return db.run(`INSERT INTO ${testConfig.db.labelsTable} VALUES(NULL, ?, ?, ?, ?, ?)`, values);
}

function addRestriction (db: Database, restriction: Restriction, hash): Promise<any> {
    const values = [restriction.ownerId, restriction.labelType, restriction.entityType, hash];
    return db.run(`INSERT INTO ${testConfig.db.restrictionsTable} VALUES(NULL, ?, ?, ?, ?)`, values);
}

function getAllLabels (db: Database): Promise<any> {
    return db.all(`SELECT ownerId, entityId, entityType, type, value FROM ${testConfig.db.labelsTable} ORDER BY id`);
}

function getAllRestrictions (db: Database): Promise<any> {
    return db.all(`SELECT ownerId, labelType, entityType FROM ${testConfig.db.restrictionsTable} ORDER BY id`);
}

function countRows (db: Database, tablename: string): Promise<number> {
    return db.get(`SELECT COUNT(1) AS count FROM ${tablename}`)
        .then((row) => {
            return row.count;
        });
}

export {addLabel, addRestriction, getAllLabels, getAllRestrictions, countRows, testConfig};
