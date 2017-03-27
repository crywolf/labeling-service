import QueryExecutorInMemory from '../../../coreEntities/QueryExecutorInMemory';
import Label from '../../../coreEntities/Label';

class ReturnEntityLabelsExecutorInMemory extends QueryExecutorInMemory {

    public fetch (
        ownerId: number,
        entityId: number,
        params?: {
            labelTypes?: Array<string>,
            labelValues?: Array<string>,
            entityTypes?: Array<string>
        }): Promise<Array<Label>> {

        const labelTypes = params ? params.labelTypes || [] : [];
        const labelValues = params ? params.labelValues || [] : [];
        const entityTypes = params ? params.entityTypes || [] : [];

        const data = Array.from(this.storage)
            .filter((label) => {
                return label.ownerId === ownerId;
            })
            .filter((label) => {
                return label.entityId === entityId;
            })
            .filter((label) => {
                if (labelTypes.length) {
                    return (labelTypes.indexOf(label.type) !== -1);
                }
                return true;
            });
        return Promise.resolve(data);
    }

}

export default ReturnEntityLabelsExecutorInMemory;
