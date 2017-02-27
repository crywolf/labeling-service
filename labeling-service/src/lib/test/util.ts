process.env.NODE_ENV = 'test';

import Label from '../../coreEntities/Label';
import {Database} from 'sqlite';
import config from '../../config';

const testConfig = config.sqlite;

function addLabel (db: Database, label: Label): Promise<any> {
    const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];
    return db.run(`INSERT INTO ${testConfig.tablename} VALUES(NULL, ?, ?, ?, ?, ?)`, values);
}

function countRows (db: Database): Promise<number> {
    return db.get(`SELECT COUNT(1) AS count FROM ${testConfig.tablename}`)
        .then((row) => {
            return row.count;
        });
}

export {addLabel, countRows};
