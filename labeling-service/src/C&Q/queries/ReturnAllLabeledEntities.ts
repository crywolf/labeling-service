import {Query, Method} from '../../coreEntities/Query';

class ReturnAllLabeledEntities extends Query {

    protected readonly settings = {
        method: Method.GET,
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        const ownerId = parseInt(req.params.ownerId, 10);

        let labelTypes = [];
        let labelOperator = 'OR';
        if (req.params.labelTypes) {
            if (req.params.labelTypes.indexOf(',') !== -1) {
                labelTypes = req.params.labelTypes.split(',');
            } else if (req.params.labelTypes.indexOf(';') !== -1) {
                labelTypes = req.params.labelTypes.split(';');
                labelOperator = 'AND';
            } else {
                labelTypes.push(req.params.labelTypes);
            }
        }

        let entityTypes = [];
        if (req.params.entityTypes) {
            if (req.params.entityTypes.indexOf(',') !== -1) {
                entityTypes = req.params.entityTypes.split(',');
            } else {
                entityTypes.push(req.params.entityTypes);
            }
        }

        const executorParams = {
            labelTypes,
            labelOperator,
            entityTypes
        };

        return this.executor.fetch(ownerId, executorParams);
    }

}

export default ReturnAllLabeledEntities;
