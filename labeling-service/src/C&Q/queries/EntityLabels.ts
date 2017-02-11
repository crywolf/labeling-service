import {Query, Method} from '../../coreEntities/Query';

class EntityLabels extends Query {

    protected readonly settings = {
        method: Method.GET,
        url: '/owner/:ownerId/labeled-entities/:entityId/labels'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);
        const entityId = parseInt(req.params.entityId, 10);

        const labelTypes = req.params.labelTypes ? req.params.labelTypes.split(',') : [];
        const labelValues = req.params.labelValues ? req.params.labelValues.split(',') : [];
        const entityTypes = req.params.entityTypes ? req.params.entityTypes.split(',') : [];

        return this.store.entityLabels(ownerId, entityId, labelTypes, labelValues, entityTypes);
    }

}

export default EntityLabels;
