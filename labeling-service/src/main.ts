import config from './config';
import {app} from './lib/app';
import storageService from './lib/store/sqliteStorageService';
// import storageService from './lib/store/memoryStorageService'; // alternative in-memory storage

app(storageService, config);
