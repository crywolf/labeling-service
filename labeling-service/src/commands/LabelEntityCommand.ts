import Command from './Command';

class LabelEntityCommand extends Command {

    protected readonly settings = {
        method: 'POST',
        url: '/owner/:ownerId/labeled-entities'
    };

    protected process (req) {
// console.log('-->', req.params, req.body);
        return new Promise((resolve) => resolve());
    }

}

export default LabelEntityCommand;
