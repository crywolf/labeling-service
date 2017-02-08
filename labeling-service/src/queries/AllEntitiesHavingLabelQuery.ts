import Query from './Query';

class AllEntitiesHavingLabelQuery extends Query {

    protected readonly settings = {
        method: 'GET',
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        return 'hello from AllEntitiesHavingLabelQuery: ' + req.params.ownerId;
    }

}

export default AllEntitiesHavingLabelQuery;
