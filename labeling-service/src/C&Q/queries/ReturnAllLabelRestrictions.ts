import {Query, Method, QuerySettings} from '../../coreEntities/Query';

class ReturnAllLabelRestrictions extends Query {

    protected readonly settings: QuerySettings = {
        method: Method.GET,
        url: '/owner/:ownerId/label-restrictions'
    };

    protected response (req) {
        const ownerId = req.params.ownerId;

        const entityTypes = req.params.entityTypes ? req.params.entityTypes.split(',') : [];

        const executorParams = {
            entityTypes
        };

        return this.executor.fetch(ownerId, executorParams);
    }

}

export default ReturnAllLabelRestrictions;
