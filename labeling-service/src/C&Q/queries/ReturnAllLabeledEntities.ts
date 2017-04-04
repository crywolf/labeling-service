import {Query, Method, QuerySettings} from '../../coreEntities/Query';

class ReturnAllLabeledEntities extends Query {

    protected readonly settings: QuerySettings = {
        method: Method.GET,
        url: '/owners/:ownerId/labeled-entities'
    };

    protected response (req) {
        const params = req.params;
        const ownerId = params.ownerId;

        let labelTypes = [];
        let labelValues = [];
        let entityTypes = [];
        let typesOperator = 'OR';
        let valuesOperator = 'OR';

        if (params.labelTypes) {
            if (this.paramsSeparatedBy(params.labelTypes, ',')) {
                labelTypes = params.labelTypes.split(',');
            } else if (this.paramsSeparatedBy(params.labelTypes, ';')) {
                labelTypes = params.labelTypes.split(';');
                typesOperator = 'AND';
            } else {
                labelTypes.push(params.labelTypes);
            }
        }

        if (params.labelValues) {
            if (this.paramsSeparatedBy(params.labelValues, ',')) {
                labelValues = params.labelValues.split(',');
            } else if (this.paramsSeparatedBy(params.labelValues, ';')) {
                labelValues = params.labelValues.split(';');
                valuesOperator = 'AND';
            } else {
                labelValues.push(params.labelValues);
            }
        }

        if (params.entityTypes) {
            if (this.paramsSeparatedBy (params.entityTypes, ',')) {
                entityTypes = params.entityTypes.split(',');
            } else {
                entityTypes.push(params.entityTypes);
            }
        }

        const executorParams = {
            labelTypes,
            typesOperator,
            labelValues,
            valuesOperator,
            entityTypes
        };

        return this.executor.fetch(ownerId, executorParams);
    }

    private paramsSeparatedBy (p: Array<any>, separator: string) {
        return p.indexOf(separator) !== -1;
    }

}

export default ReturnAllLabeledEntities;
