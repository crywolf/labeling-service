import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import * as squel from 'squel';

class RemoveLabelRestrictionExecutorSql extends CommandExecutorSql {

    public execute (ownerId: number, valueHash?: string): Promise<void> {

        const sql = squel.delete()
            .from(this.tables.restrictionsTable)
            .where('ownerId = ?', ownerId);

        if (valueHash) {
            sql.where('hash = ?', valueHash);
        }

        return this.storage.run(sql.toString())
            .then(() => {
                return;
            }).catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }
}

export default RemoveLabelRestrictionExecutorSql;
