import Command from '../../coreEntities/Command';

class LabelEntityCommand extends Command {

    protected readonly settings = {
        method: 'POST',
        url: '/owner/:ownerId/labeled-entities'
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

export default LabelEntityCommand;
