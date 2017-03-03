import {Command, Method} from '../../coreEntities/Command';

class RemoveLabelRestriction extends Command {

    protected readonly settings = {
        method: Method.DELETE,
        url: '/owner/:ownerId/label-restrictions/:valueHash'
    };

    protected process (req) {
        const ownerId = parseInt(req.params.ownerId, 10);
        const valueHash = req.params.valueHash;

        return this.executor.execute(ownerId, valueHash);
    }

}

export default RemoveLabelRestriction;
