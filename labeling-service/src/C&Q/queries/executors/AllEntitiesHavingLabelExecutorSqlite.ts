import Label from '../../../coreEntities/Label';
import QueryExecutorSqlite from '../../../coreEntities/QueryExecutorSqlite';
import logger from '../../../lib/logger';
import InternalServerError from '../../../coreEntities/InternalServerError';

class AllEntitiesHavingLabelExecutorSqlite extends QueryExecutorSqlite {

    public fetch (ownerId: number, labelTypes: Array<string> = [],
                  entityTypes: Array<string> = []): Promise<Array<Label>> {

        const sql = `SELECT * FROM ${this.tablename} WHERE ownerId = ?;`;

        return this.storage.all(sql, ownerId)
            .then((rows) => {
// console.log('--->', sql, rows);
                return rows;
            }).catch((err) => {
                logger.error(err, this.constructor.name);
                throw new InternalServerError(err.message);
            });
    }

}

export default AllEntitiesHavingLabelExecutorSqlite;
