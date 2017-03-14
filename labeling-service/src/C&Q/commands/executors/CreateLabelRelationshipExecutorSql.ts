import Label from '../../../coreEntities/Label';
import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';

class CreateLabelRelationshipExecutorSql extends CommandExecutorSql {

    public execute (label: Label): Promise<Label> {
        const sql = `INSERT INTO ${this.tables.labelsTable}
                    (id, ownerId, entityId, entityType, type, value) 
                    VALUES(NULL, ?, ?, ?, ?, ?);`;

        const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];

        return this.storage.run(sql, values)
            .then(() => {
                return label;
            })
            .catch((err) => {
                if (this.isUniqueConstraintError(err)) {
                    return label;
                } else {
                    const message = `${this.constructor.name}: ${err.message}`;
                    throw new InternalServerError(message);
                }
            });
    }
}

export default CreateLabelRelationshipExecutorSql;
