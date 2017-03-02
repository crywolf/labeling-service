import Label from '../../../coreEntities/Label';
import CommandExecutorSqlite from '../../../coreEntities/CommandExecutorSqlite';
import InternalServerError from '../../../coreEntities/InternalServerError';

class CreateLabelRelationshipExecutorSqlite extends CommandExecutorSqlite {

    public execute (label: Label): Promise<Label> {
        const sql = `INSERT INTO ${this.tables.labelsTable}
                    (id, ownerId, entityId, entityType, type, value) 
                    VALUES(NULL, ?, ?, ?, ?, ?);`;

        const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];

        return this.storage.run(sql, values)
            .then(() => {
                return label;
            }).catch((err) => {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return label;
                } else {
                    const message = `${this.constructor.name}: ${err.message}`;
                    throw new InternalServerError(message);
                }
            });
    }
}

export default CreateLabelRelationshipExecutorSqlite;
