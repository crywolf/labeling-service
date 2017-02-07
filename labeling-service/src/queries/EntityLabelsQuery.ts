import Query from './Query';

class EntityLabelsQuery extends Query {

    protected readonly settings = {
        method: 'GET',
        url: '/hello/:name'
    };

    protected response (req) {
        return 'hello ' + req.params.name;
    }

}

export default EntityLabelsQuery;
