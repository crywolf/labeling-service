import Label from '../../../coreEntities/Label';
import QueryExecutorSqlite from '../../../coreEntities/QueryExecutorSqlite';
import logger from '../../../lib/logger';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class AllEntitiesHavingLabelExecutorSqlite extends QueryExecutorSqlite {

    public fetch (
        ownerId: number,
        params?: {
            labelTypes?: Array<string>,
            labelOperator?: string,
            entityTypes?: Array<string>,
            entityOperator?: string
        }): Promise<Array<Label>> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelOperator = params ? params.labelOperator || 'OR' : 'OR';
        const entityTypes = params ? params.entityTypes || [] : [];
        // but entity operator === 'AND' does not make sense!!!
        const entityOperator = params ? params.entityOperator || 'OR' : 'OR';

        const select = squel.select()
            .from(this.tablename)
//            .field('ownerId')
            .field('entityId')
            .field('entityType')
            .field('count(1) as count')
//            .field('type')
//            .field('value')
            .group('entityType');

        const where = squel.expr();

        const whereLabelTypes = squel.expr();
        if (labelTypes.length) {
            labelTypes.forEach((labelType) => {
                whereLabelTypes.or('type = ?', labelType);
            });
            if (labelOperator === 'AND') {
                select.having('count = ?', labelTypes.length);
            }
        }

        const whereEntityTypes = squel.expr();
        if (entityTypes.length) {
            entityTypes.forEach((entityType) => {
                if (entityOperator === 'AND') {
                    // but entity operator === 'AND' does not make sense!!!
                    whereEntityTypes.and('entityType = ?', entityType);
                } else {
                    whereEntityTypes.or('entityType = ?', entityType);
                }
            });
        }

        if (whereLabelTypes._nodes.length) {
            where.and(whereLabelTypes);
        }
        if (whereEntityTypes._nodes.length) {
            where.and(whereEntityTypes);
        }

        where.and('ownerId = ?', ownerId);
        const sql = select.where(where);

console.log(sql.toString());

        return this.storage.all(sql.toString())
            .then((rows) => {
//console.log('--->', sql.toString(), rows);
                rows.map((row) => {
                    delete row.count;
                });
                return rows;
            }).catch((err) => {
                logger.error(err, this.constructor.name);
                throw new InternalServerError(err.message);
            });
    }

}

export default AllEntitiesHavingLabelExecutorSqlite;
