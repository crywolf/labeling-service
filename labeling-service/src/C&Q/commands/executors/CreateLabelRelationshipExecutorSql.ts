import Label from '../../../coreEntities/Label';
import CommandExecutorSql from '../../../coreEntities/CommandExecutorSql';
import InternalServerError from '../../../coreEntities/InternalServerError';
import UnprocessableEntityError from '../../../coreEntities/UnprocessableEntityError';
import * as squel from 'squel';
import Restriction from '../../../coreEntities/Restriction';

class CreateLabelRelationshipExecutorSql extends CommandExecutorSql {

    public execute (label: Label): Promise<void> {

        return this.getRestrictions(label.ownerId)
            .then((restrictions) => {
                if (restrictions.length) {
                    const allowed = this.checkRestrictions(restrictions, label);
                    if (allowed) {
                        return this.insertLabel(label) as Promise<void>;
                    } else {
                        return Promise.reject(
                            new UnprocessableEntityError('Forbidden label type because of restriction!')
                        );
                    }
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

    private getRestrictions (ownerId: string): Promise<Array<Restriction>> {
        const sql = squel.select()
            .from(this.tables.restrictionsTable)
            .field('ownerId')
            .field('labelType')
            .field('entityType')
            .where('ownerId = ?', ownerId);

        return this.storage.all(sql.toString())
            .then((rows) => {
                return rows;
            })
            .catch((err) => {
                const message = `${this.constructor.name}: ${err.message}`;
                throw new InternalServerError(message);
            });
    }

    private checkRestrictions (restrictions: Array<Restriction>, label: Label): boolean {
        let isOk = false;
        const entityRestrictions = [];
        const globalRestrictions = [];

        restrictions.forEach((restriction) => {
            if (restriction.entityType) {
                if (label.entityType === restriction.entityType) {
                    if (label.type === restriction.labelType) {
                        entityRestrictions.push(true);
                        return;
                    } else {
                        entityRestrictions.push(false);
                    }
                }
            } else {
                if (label.type === restriction.labelType) {
                    globalRestrictions.push(true);
                } else {
                    globalRestrictions.push(false);
                }
            }
        });

        if (entityRestrictions.length) {
            isOk = entityRestrictions.find((v) => v === true);
        } else if (globalRestrictions.length) {
            isOk = globalRestrictions.find((v) => v === true);
        } else {
            isOk = true;
        }

        return isOk;
    }

}

export default CreateLabelRelationshipExecutorSql;
