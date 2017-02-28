import {Command, Method} from '../../coreEntities/Command';

class RemoveLabel extends Command {

    protected readonly settings = {
        method: Method.DELETE,
        url: '/owner/:ownerId/labeled-entities/:entityId/labels'
    };

    protected process (req) {
        const ownerId = parseInt(req.params.ownerId, 10);
        const entityId = parseInt(req.params.entityId, 10);

        const labelTypes = req.params.labelTypes ? req.params.labelTypes.split(',') : [];
        const labelValues = req.params.labelValues ? req.params.labelValues.split(',') : [];

        const executorParams = {
            labelTypes,
            labelValues
        };

        return this.executor.execute(ownerId, entityId, executorParams);
    }

}

export default RemoveLabel;
