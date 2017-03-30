import {Command, CommandSettings, Method} from '../../coreEntities/Command';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';

class CreateLabelRelationship extends Command {

    protected readonly settings: CommandSettings = {
        method: Method.POST,
        url: '/owner/:ownerId/label-relationships'
    };

    protected process (req) {
        const label = {
            ownerId: req.params.ownerId,
            entityId: req.body.entityId,
            entityType: req.body.entityType,
            type: req.body.labelType,
            value: req.body.labelValue
        };

        if (!label.entityId) {
            return Promise.reject(new UnprocessableEntityError('EntityId is missing!'));
        }
        if (!label.entityType) {
            return Promise.reject(new UnprocessableEntityError('EntityType is missing!'));
        }
        if (!label.type) {
            return Promise.reject(new UnprocessableEntityError('Label type is missing!'));
        }

        return this.executor.execute(label);
    }

}

export default CreateLabelRelationship;
