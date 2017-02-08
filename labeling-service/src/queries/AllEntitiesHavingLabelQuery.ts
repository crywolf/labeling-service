import Query from './Query';

class AllEntitiesHavingLabelQuery extends Query {

    protected readonly settings = {
        method: 'GET',
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        const data = 'hello from AllEntitiesHavingLabelQuery: ' + req.params.ownerId;
        return new Promise((resolve) => resolve(data));
    }

}

export default AllEntitiesHavingLabelQuery;
