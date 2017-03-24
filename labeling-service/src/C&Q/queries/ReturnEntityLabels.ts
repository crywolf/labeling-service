import {Query, Method, QuerySettings} from '../../coreEntities/Query';

class ReturnEntityLabels extends Query {

    protected readonly settings: QuerySettings = {
        method: Method.GET,
        url: '/owner/:ownerId/labeled-entities/:entityId/labels'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);
        const entityId = parseInt(req.params.entityId, 10);

        const labelTypes = req.params.labelTypes ? req.params.labelTypes.split(',') : [];
        const labelValues = req.params.labelValues ? req.params.labelValues.split(',') : [];

        const executorParams = {
            labelTypes,
            labelValues
        };

        return this.executor.fetch(ownerId, entityId, executorParams);
    }

}

export default ReturnEntityLabels;
