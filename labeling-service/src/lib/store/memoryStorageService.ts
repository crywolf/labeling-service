import Label from '../../coreEntities/Label';
import logger from '../logger';
import StorageService from './StorageService';
logger.module('MemoryStorageService');

class MemoryStorageService implements StorageService {

    private memoryStorage: Set<Label>;

    public init () {
        logger.info('Initializing memoryStorageService...', this.constructor.name);
        this.memoryStorage = new Set();
        return Promise.resolve();
    }

    get db (): Set<Label> {
        return this.memoryStorage;
    }

    public truncate (): Promise<void> {
        this.memoryStorage = new Set();
        logger.info('Memory storage cleared.', this.constructor.name);
        return Promise.resolve();
    }

}

export default new MemoryStorageService();
