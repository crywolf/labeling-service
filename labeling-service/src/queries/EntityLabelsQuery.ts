import Query from './Query';

class EntityLabelsQuery extends Query {

    protected readonly settings = {
        method: 'GET',
        url: '/hello/:name'
    };

    protected response (req) {
        const data = 'hello ' + req.params.name;
        return new Promise((resolve) => resolve(data));
    }

}

export default EntityLabelsQuery;
