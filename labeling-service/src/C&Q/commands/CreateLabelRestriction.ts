import {Command, Method} from '../../coreEntities/Command';
import UnprocessableEntityError from '../../coreEntities/UnprocessableEntityError';

class CreateLabelRestriction extends Command {

    protected readonly settings = {
        method: Method.POST,
        url: '/owner/:ownerId/label-restrictions'
    };

    protected process (req) {
        const restriction = {
            ownerId: parseInt(req.params.ownerId, 10),
            labelType: req.body.labelType,
            entityType: req.body.entityType
        };

        if (!restriction.labelType) {
            return Promise.reject(new UnprocessableEntityError('Label type is missing!'));
        }

        return this.executor.execute(restriction)
            .then(() => {
                return;
            });
    }

}

export default CreateLabelRestriction;
