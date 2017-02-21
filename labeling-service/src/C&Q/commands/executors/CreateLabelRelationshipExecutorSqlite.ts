import Label from '../../../coreEntities/Label';
import CommandExecutorSqlite from '../../../coreEntities/CommandExecutorSqlite';
import logger from '../../../lib/logger';
import InternalServerError from '../../../coreEntities/InternalServerError';

class CreateLabelRelationshipExecutorSqlite extends CommandExecutorSqlite {

    public execute (label: Label): Promise<Label> {
        const sql = `INSERT INTO ${this.tablename}
                    (id, ownerId, entityId, entityType, type, value) 
                    VALUES(NULL, ?, ?, ?, ?, ?);`;

        const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];

        return this.storage.run(sql, values)
            .then(() => {
                return label;
            }).catch((err) => {
                logger.error(err, this.constructor.name);
                throw new InternalServerError(err.message);
            });
    }
}

export default CreateLabelRelationshipExecutorSqlite;
