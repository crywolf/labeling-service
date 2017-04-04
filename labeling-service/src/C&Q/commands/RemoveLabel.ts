import {Command, CommandSettings, Method} from '../../coreEntities/Command';

class RemoveLabel extends Command {

    protected readonly settings: CommandSettings = {
        method: Method.DELETE,
        url: '/owners/:ownerId/labeled-entities/:entityId/labels'
    };

    protected process (req) {
        const ownerId = req.params.ownerId;
        const entityId = req.params.entityId;

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
