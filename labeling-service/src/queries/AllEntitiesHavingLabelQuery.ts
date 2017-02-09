import Query from './Query';

class AllEntitiesHavingLabelQuery extends Query {

    protected readonly settings = {
        method: 'GET',
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);

        const labelTypes = req.params.labelTypes ? req.params.labelTypes.split(',') : [];
        const entityTypes = req.params.entityTypes ? req.params.entityTypes.split(',') : [];

        return this.store.allEntitiesHavingLabel(ownerId, labelTypes, entityTypes)
            .then(this.formatData);
    }

    private formatData (data: Array<any>) {
        const formattedData = data.map((label) => {
            return {
                entityId: label.entityId,
                entityType: label.entityType,
                label: {
                    type: label.type,
                    value: label.value
                }
            };
        });
        return new Promise((resolve) => resolve(formattedData));
    }

}

export default AllEntitiesHavingLabelQuery;
