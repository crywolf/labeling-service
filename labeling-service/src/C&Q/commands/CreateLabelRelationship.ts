import {Command, Method} from '../../coreEntities/Command';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';

class CreateLabelRelationship extends Command {

    protected readonly settings = {
        method: Method.POST,
        url: '/owner/:ownerId/label-relationships'
    };

    protected process (req) {
        const label = {
            ownerId: parseInt(req.params.ownerId, 10),
            entityId: req.body.entityId,
            entityType: req.body.entityType,
            type: req.body.type,
            value: req.body.value
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

        return this.executor.execute(label)
            .then(() => {
                return;
            });
    }

}

export default CreateLabelRelationship;
