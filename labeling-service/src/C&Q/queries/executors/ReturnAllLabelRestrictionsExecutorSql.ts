import Restriction from '../../../coreEntities/Restriction';
import QueryExecutorSql from '../../../coreEntities/QueryExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class ReturnAllLabelRestrictionsExecutorSql extends QueryExecutorSql {

    public fetch (
        ownerId: number,
        params?: {
            entityTypes?: Array<string>
        }): Promise<Array<Restriction>> {

        const entityTypes = params ? params.entityTypes || [] : [];

        const select = squel.select()
            .from(this.tables.restrictionsTable)
            .field('hash', 'hashValue')
            .field('labelType')
            .field('entityType')
            .order('id');

        const where = squel.expr();

        const whereEntityTypes = squel.expr();
        if (entityTypes.length) {
            entityTypes.forEach((entityType) => {
                whereEntityTypes.or('entityType = ?', entityType);
            });
        }

        if (whereEntityTypes._nodes.length) {
            where.and(whereEntityTypes);
        }

        where.and('ownerId = ?', ownerId);

        const sql = select.where(where);

        return this.storage.all(sql.toString())
            .then((rows) => {
                return rows;
            })
            .catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }

}

export default ReturnAllLabelRestrictionsExecutorSql;
