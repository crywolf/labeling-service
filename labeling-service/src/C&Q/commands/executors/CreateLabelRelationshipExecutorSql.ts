import Label from '../../../coreEntities/Label';
import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import UnprocessableEntityError from '../../../coreEntities/UnprocessableEntityError';
import * as squel from 'squel';

class CreateLabelRelationshipExecutorSql extends CommandExecutorSql {

    public execute (label: Label): Promise<void> {

        return this.restrictionExists(label)
            .then((exists) => {
                if (exists) {
                    return Promise.reject(new UnprocessableEntityError('Forbidden label type because of restriction!'));
                } else {
                    return this.insertLabel(label) as Promise<void>;
                }
            });

    }

    public insertLabel (label) {
        const sql = `INSERT INTO ${this.tables.labelsTable}
                    (id, ownerId, entityId, entityType, type, value) 
                    VALUES(NULL, ?, ?, ?, ?, ?);`;

        const values = [label.ownerId, label.entityId, label.entityType, label.type, label.value];

        return this.storage.run(sql, values)
            .then(() => {
                return;
            })
            .catch((err) => {
                if (this.isUniqueConstraintError(err)) {
                    return;
                } else {
                    const message = `${this.constructor.name}: ${err.message}`;
                    throw new InternalServerError(message);
                }
            });
    }

    private restrictionExists (label: Label): Promise<boolean> {
        const select = squel.select()
            .from(this.tables.restrictionsTable)
            .field('COUNT(1)', 'count');

        const whereEntityType = squel.expr();
        whereEntityType.and('entityType IS NULL').or('entityType = ?', label.entityType);

        const where = squel.expr();
        where.and('ownerId = ?', label.ownerId)
             .and('labelType = ?', label.type)
             .and(whereEntityType);

        const sql = select.where(where);

        return this.storage.all(sql.toString())
            .then((rows) => {
                return !!rows[0].count;
            })
            .catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }
}

export default CreateLabelRelationshipExecutorSql;
