import Restriction from '../../../coreEntities/Restriction';
import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import RestrictionHasher from '../../../coreEntities/RestrictionHasher';

class CreateLabelRestrictionExecutorSql extends CommandExecutorSql {

    public execute (restriction: Restriction): Promise<void> {

        const sql = `INSERT INTO ${this.tables.restrictionsTable}
                    (id, ownerId, labelType, entityType, hash) 
                    VALUES(NULL, ?, ?, ?, ?);`;

        const hasher = new RestrictionHasher();

        return hasher.createHash(restriction)
            .then((hash) => {
                const values = [restriction.ownerId, restriction.labelType, restriction.entityType, hash];

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
                    }) as Promise<void>;
            });
    }

}

export default CreateLabelRestrictionExecutorSql;
