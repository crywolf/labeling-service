import Label from '../../../coreEntities/Label';
import QueryExecutorSql from '../../../coreEntities/QueryExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class ReturnAllLabeledEntitiesExecutorSql extends QueryExecutorSql {

    public fetch (
        ownerId: string,
        params?: {
            labelTypes?: Array<string>,
            typesOperator?: string,
            labelValues?: Array<string>,
            valuesOperator?: string,
            entityTypes?: Array<string>
        }): Promise<Array<Label>> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelValues = params ? params.labelValues || [] : [];
        const typesOperator = params ? params.typesOperator || 'OR' : 'OR';
        const valuesOperator = params ? params.valuesOperator || 'OR' : 'OR';
        const entityTypes = params ? params.entityTypes || [] : [];

        const subselectsSql = [];
        const select = squel.select()
            .from(this.tables.labelsTable)
            .field('entityId')
            .field('entityType')
            .group('entityId');

        const where = squel.expr();

        const whereLabelTypes = squel.expr();
        if (labelTypes.length) {
            labelTypes.forEach((labelType) => {
                if (typesOperator === 'AND') {
                    const subselect = select.clone().where(
                        squel.expr().and('type = ?', labelType).and('ownerId = ?', ownerId)
                    );
                    subselectsSql.push(subselect);
                } else {
                    whereLabelTypes.or('type = ?', labelType);
                }
            });
        }

        const whereLabelValues = squel.expr();
        if (labelValues.length) {
            labelValues.forEach((labelValue) => {
                if (valuesOperator === 'AND') {
                    const subselect = select.clone().where(
                        squel.expr().and('value = ?', labelValue).and('ownerId = ?', ownerId)
                    );
                    subselectsSql.push(subselect);
                } else {
                    whereLabelValues.or('value = ?', labelValue);
                }
            });
        }

        const whereEntityTypes = squel.expr();
        if (entityTypes.length) {
            entityTypes.forEach((entityType) => {
                whereEntityTypes.or('entityType = ?', entityType);
            });
        }

        if (whereLabelTypes._nodes.length) {
            where.and(whereLabelTypes);
        }
        if (whereLabelValues._nodes.length) {
            where.and(whereLabelValues);
        }
        if (whereEntityTypes._nodes.length) {
            where.and(whereEntityTypes);
        }

        let sql;
        if (subselectsSql.length) {
            subselectsSql.map((subselect) => {
                return subselect.where(whereEntityTypes).toString();
            });
            sql = subselectsSql.join(' INTERSECT ');
            sql += ' ORDER BY entityId';
        } else {
            where.and('ownerId = ?', ownerId);
            sql = select.where(where);
        }

        return this.storage.all(sql.toString())
            .then((rows) => {
                return rows;
            }).catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }

}

export default ReturnAllLabeledEntitiesExecutorSql;
