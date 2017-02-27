import QueryExecutorInMemory from '../../../coreEntities/QueryExecutorInMemory';

class ReturnEntityLabelsExecutorInMemory extends QueryExecutorInMemory {

    public fetch (
        ownerId: number,
        entityId: number,
        labelTypes: Array<string> = [],
        labelValues: Array<string> = [],
        entityTypes: Array<string> = []
    ): Promise<any> {

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
