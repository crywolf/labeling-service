import {Query, Method} from '../../coreEntities/Query';

class AllEntitiesHavingLabel extends Query {

    protected readonly settings = {
        method: Method.GET,
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);

        const labelTypes = req.params.labelTypes ? req.params.labelTypes.split(',') : [];
        const entityTypes = req.params.entityTypes ? req.params.entityTypes.split(',') : [];

        return this.executor.fetch(ownerId, labelTypes, entityTypes)
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
        return Promise.resolve(formattedData);
    }

}

export default AllEntitiesHavingLabel;
