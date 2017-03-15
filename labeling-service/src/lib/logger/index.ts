import {Logger} from './Logger';
import {Console} from 'console';
import {createWriteStream} from 'fs';

let cons;

if (process.env.NODE_ENV === 'testing') {
    const nullStream = createWriteStream('/dev/null');
    cons = new Console(nullStream, nullStream);
} else {
    cons = new Console(process.stdout, process.stderr);
}

export default new Logger(cons);
