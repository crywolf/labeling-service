import Command from './Command';

class RemoveLabelCommand extends Command {

    protected readonly settings = {
        method: 'DELETE',
        url: '/owner/:ownerId/labeled-entities/:entityId/labels'
    };

    protected process (req) {
//  console.log('--> DELETE', req.params, req.body);
        return new Promise((resolve) => resolve());
    }

}

export default RemoveLabelCommand;
