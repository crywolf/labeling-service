import {Command, Method} from '../../coreEntities/Command';

class RemoveLabel extends Command {

    protected readonly settings = {
        method: Method.DELETE,
        url: '/owner/:ownerId/labeled-entities/:entityId/labels'
    };

    protected process (req) {
//  console.log('--> DELETE', req.params, req.body);
        return new Promise((resolve) => resolve());
    }

}

export default RemoveLabel;
