import Label from '../../../coreEntities/Label';
import QueryExecutorInMemory from '../../../coreEntities/QueryExecutorInMemory';

class ReturnAllLabeledEntitiesExecutorInMemory extends QueryExecutorInMemory {

    public fetch (ownerId: string, labelTypes: Array<string> = [],
                  entityTypes: Array<string> = []): Promise<Array<Label>> {

        const data = Array.from(this.storage)
            .filter((label) => {
                return label.ownerId === ownerId;
            })
            .filter((label) => {
                if (labelTypes.length) {
                    return (labelTypes.indexOf(label.type) !== -1);
                }
                return true;
            })
            .filter((label) => {
                if (entityTypes.length) {
                    return (entityTypes.indexOf(label.entityType) !== -1);
                }
                return true;
            });

        return Promise.resolve(data);
    }

}

export default ReturnAllLabeledEntitiesExecutorInMemory;
