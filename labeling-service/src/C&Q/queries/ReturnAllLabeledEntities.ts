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
            } else if (req.params.labelTypes.indexOf('+') !== -1) {
                labelTypes = req.params.labelTypes.split('+');
                labelOperator = 'AND';
            }
        }

        let entityTypes = [];
        let entityOperator = 'OR';
        if (req.params.entityTypes) {
            if (req.params.entityTypes.indexOf(',') !== -1) {
                entityTypes = req.params.entityTypes.split(',');
            } else if (req.params.entityTypes.indexOf('+') !== -1) {
                // TODO but entityOperator === 'AND' does not make sense!!!
                entityTypes = req.params.entityTypes.split('+');
                entityOperator = 'AND';
            }
        }

        const executorParams = {
            labelTypes,
            labelOperator,
            entityTypes,
            entityOperator
        };

        return this.executor.fetch(ownerId, executorParams);
    }

}

export default ReturnAllLabeledEntities;
