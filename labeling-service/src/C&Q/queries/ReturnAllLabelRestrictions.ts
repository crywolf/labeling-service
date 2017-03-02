import {Query, Method} from '../../coreEntities/Query';

class ReturnAllLabelRestrictions extends Query {

    protected readonly settings = {
        method: Method.GET,
        url: '/owner/:ownerId/label-restrictions'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);

        const entityTypes = req.params.entityTypes ? req.params.entityTypes.split(',') : [];

        const executorParams = {
            entityTypes
        };

        return this.executor.fetch(ownerId, executorParams);
    }

}

export default ReturnAllLabelRestrictions;
