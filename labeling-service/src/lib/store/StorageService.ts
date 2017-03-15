interface StorageService {
    readonly db;
    init (config: {}): Promise<any>;
    truncate (): Promise<any>;
}

export default StorageService;
