import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class RemoveLabelExecutorSqlite extends CommandExecutorSql {

    public execute (
        ownerId: number,
        entityId: number,
        params?: {
            labelTypes?: Array<string>,
            labelValues?: Array<string>
        }): Promise<void> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelValues = params ? params.labelValues || [] : [];

        const sql = squel.delete().from(this.tables.labelsTable);

        const where = squel.expr();

        const whereLabelTypes = squel.expr();
        if (labelTypes.length) {
            labelTypes.forEach((labelType) => {
                whereLabelTypes.or('type = ?', labelType);
            });
        }

        const whereLabelValues = squel.expr();
        if (labelValues.length) {
            labelValues.forEach((labelValue) => {
                whereLabelValues.or('value = ?', labelValue);
            });
        }

        if (whereLabelTypes._nodes.length) {
            where.and(whereLabelTypes);
        }
        if (whereLabelValues._nodes.length) {
            where.and(whereLabelValues);
        }
        where.and('ownerId = ?', ownerId);
        where.and('entityId = ?', entityId);

        sql.where(where);

        return this.storage.run(sql.toString())
            .then(() => {
                return;
            }).catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }
}

export default RemoveLabelExecutorSqlite;
