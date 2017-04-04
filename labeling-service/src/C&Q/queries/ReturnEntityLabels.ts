import {Query, Method, QuerySettings} from '../../coreEntities/Query';

class ReturnEntityLabels extends Query {

    protected readonly settings: QuerySettings = {
        method: Method.GET,
        url: '/owners/:ownerId/labeled-entities/:entityId/labels'
    };

    protected response (req) {
        const ownerId = req.params.ownerId;
        const entityId = req.params.entityId;

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
