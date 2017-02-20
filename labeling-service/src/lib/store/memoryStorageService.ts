import Label from '../../coreEntities/Label';
import logger from '../logger';
logger.module('MemoryStorageService');

class MemoryStorageService {

    private memoryStorage: Set<Label>;

    public init () {
        logger.info('Initializing memoryStorageService...', this.constructor.name);
        this.memoryStorage = new Set();

        return Promise.resolve();
    }

    get storage (): Set<Label> {
        return this.memoryStorage;
    }
}

export default new MemoryStorageService();
