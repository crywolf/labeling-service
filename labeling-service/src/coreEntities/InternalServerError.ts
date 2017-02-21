import * as restify from 'restify';
import * as util from 'util';

function InternalServerError (message) {
    restify.InternalServerError.call(this, {
        message,
        constructorOpt: InternalServerError
    });
    this.name = 'InternalServerError';
}
util.inherits(InternalServerError, restify.RestError);

export default InternalServerError;
