import {Query, Method} from '../../coreEntities/Query';

class AllEntitiesHavingLabel extends Query {

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

console.log(req.params.labelTypes, labelTypes);

        let entityTypes = [];
        let entityOperator = 'OR';
        if (req.params.entityTypes) {
            if (req.params.entityTypes.indexOf(',') !== -1) {
                entityTypes = req.params.entityTypes.split(',');
            } else if (req.params.entityTypes.indexOf('+') !== -1) {
                // but entity operator === 'AND' does not make sense!!!
                entityTypes = req.params.entityTypes.split('+');
                entityOperator = 'AND';
            }
        }

console.log(req.params.entityTypes, entityTypes);

        const executorParams = {
            labelTypes,
            labelOperator,
            entityTypes,
            entityOperator
        };

        return this.executor.fetch(ownerId, executorParams)
        //    .then(this.formatData);
    }

    private formatData (data: Array<any>) {
        const formattedData = data.map((label) => {
            return {
                entityId: label.entityId,
                entityType: label.entityType
            };
        });
        return Promise.resolve(formattedData);
    }

}

export default AllEntitiesHavingLabel;
