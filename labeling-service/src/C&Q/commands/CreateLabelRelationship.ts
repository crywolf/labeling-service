import {Command, Method} from '../../coreEntities/Command';

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
        return this.store.labelEntity(label);
    }

}

export default CreateLabelRelationship;
