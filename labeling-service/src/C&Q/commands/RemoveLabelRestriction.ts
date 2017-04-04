import {Command, CommandSettings, Method} from '../../coreEntities/Command';

class RemoveLabelRestriction extends Command {

    protected readonly settings: CommandSettings = {
        method: Method.DELETE,
        url: '/owners/:ownerId/label-restrictions/:valueHash'
    };

    protected process (req) {
        const ownerId = req.params.ownerId;
        const valueHash = req.params.valueHash;

        return this.executor.execute(ownerId, valueHash);
    }

}

export default RemoveLabelRestriction;
