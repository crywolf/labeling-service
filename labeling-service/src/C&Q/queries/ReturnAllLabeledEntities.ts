import {Query, Method, QuerySettings} from '../../coreEntities/Query';

class ReturnAllLabeledEntities extends Query {

    protected readonly settings: QuerySettings = {
        method: Method.GET,
        url: '/owner/:ownerId/labeled-entities'
    };

    protected response (req) {
        const params = req.params;
        const ownerId = params.ownerId;

        let labelTypes = [];
        let entityTypes = [];
        let labelOperator = 'OR';

        if (params.labelTypes) {
            if (this.paramsSeparatedBy(params.labelTypes, ',')) {
                labelTypes = params.labelTypes.split(',');
            } else if (this.paramsSeparatedBy(params.labelTypes, ';')) {
                labelTypes = params.labelTypes.split(';');
                labelOperator = 'AND';
            } else {
                labelTypes.push(params.labelTypes);
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
            labelOperator,
            entityTypes
        };

        return this.executor.fetch(ownerId, executorParams);
    }

    private paramsSeparatedBy (p: Array<any>, separator: string) {
        return p.indexOf(separator) !== -1;
    }

}

export default ReturnAllLabeledEntities;
