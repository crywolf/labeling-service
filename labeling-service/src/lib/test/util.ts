process.env.NODE_ENV = 'test';

import Label from '../../coreEntities/Label';
import Restriction from '../../coreEntities/Restriction';
import {Database} from 'sqlite';
import config from '../../config';

const testConfig = config.sqlite;

function addLabel (db: Database, label: Label): Promise<any> {
    const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];
    return db.run(`INSERT INTO ${testConfig.labelsTable} VALUES(NULL, ?, ?, ?, ?, ?)`, values);
}

function addRestriction (db: Database, restriction: Restriction, hash): Promise<any> {
    const values = [restriction.ownerId, restriction.labelType, restriction.entityType, hash];
    return db.run(`INSERT INTO ${testConfig.restrictionsTable} VALUES(NULL, ?, ?, ?, ?)`, values);
}

function getAllLabels (db: Database): Promise<any> {
    return db.all(`SELECT ownerId, entityId, entityType, type, value FROM ${testConfig.labelsTable} ORDER BY 'id'`);
}

function countRows (db: Database, tablename: string): Promise<number> {
    return db.get(`SELECT COUNT(1) AS count FROM ${tablename}`)
        .then((row) => {
            return row.count;
        });
}

export {addLabel, addRestriction, getAllLabels, countRows};
