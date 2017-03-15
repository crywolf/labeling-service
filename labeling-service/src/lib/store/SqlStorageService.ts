import SqlDatabase from '../../coreEntities/SqlDatabase';
import StorageService from './StorageService';

interface SqlStorageService extends StorageService {
    readonly db: SqlDatabase;
    init (config: {}): Promise<SqlDatabase>;
    isUniqueConstraintError (err): boolean;
    truncate (): Promise<any>;
}

export default SqlStorageService;
