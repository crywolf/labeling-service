import Label from '../../../coreEntities/Label';
import QueryExecutorSqlite from '../../../coreEntities/QueryExecutorSqlite';
import logger from '../../../lib/logger';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class ReturnAllLabeledEntitiesExecutorSqlite extends QueryExecutorSqlite {

    public fetch (
        ownerId: number,
        params?: {
            labelTypes?: Array<string>,
            labelOperator?: string,
            entityTypes?: Array<string>
        }): Promise<Array<Label>> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelOperator = params ? params.labelOperator || 'OR' : 'OR';
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
                if (labelOperator === 'AND') {
                    const subselect = select.clone().where(
                        squel.expr().and('type = ?', labelType).and('ownerId = ?', ownerId)
                    );
                    subselectsSql.push(subselect);
                } else {
                    whereLabelTypes.or('type = ?', labelType);
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

export default ReturnAllLabeledEntitiesExecutorSqlite;
