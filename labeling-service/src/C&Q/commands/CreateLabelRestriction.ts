import {Command, CommandSettings, Method} from '../../coreEntities/Command';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';

class CreateLabelRestriction extends Command {

    protected readonly settings: CommandSettings = {
        method: Method.POST,
        url: '/owners/:ownerId/label-restrictions'
    };

    protected process (req) {
        const restriction = {
            ownerId: req.params.ownerId,
            labelType: req.body.labelType,
            entityType: req.body.entityType
        };

        if (!restriction.labelType) {
            return Promise.reject(new UnprocessableEntityError('Label type is missing!'));
        }

        return this.executor.execute(restriction);
    }

}

export default CreateLabelRestriction;
