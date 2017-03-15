interface StorageService {
    readonly db;
    init (config: {});
    truncate (): Promise<any>;
}

export default StorageService;
