import Label from '../../../coreEntities/Label';
import QueryExecutorSql from '../../../coreEntities/QueryExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class ReturnEntityLabelsExecutorSql extends QueryExecutorSql {

    public fetch (
        ownerId: string,
        entityId: string,
        params?: {
            labelTypes?: Array<string>,
            labelValues?: Array<string>
        }): Promise<Array<Label>> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelValues = params ? params.labelValues || [] : [];

        const select = squel.select()
            .from(this.tables.labelsTable)
            .field('type')
            .field('value')
            .order('id');

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

        const sql = select.where(where);

        return this.storage.all(sql.toString())
            .then((rows) => {
                return rows;
            }).catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }

}

export default ReturnEntityLabelsExecutorSql;
