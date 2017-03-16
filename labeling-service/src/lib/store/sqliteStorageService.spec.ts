import {expect} from 'chai';
import SqlStorageService from './SqlStorageService';
import SqliteStorageService from './sqliteStorageService';
import {Console} from 'console';

describe('sqliteStorageService', () => {

    let sqliteStorageService1: SqlStorageService;
    let sqliteStorageService2: SqlStorageService;
    let cons;

    beforeEach(() => {
        sqliteStorageService1 = initializeStorageService();
        sqliteStorageService2 = initializeStorageService();
        cons = new Console(process.stdout, process.stderr);
    });

    describe('when asked to instantiate', () => {

        it('should return a Singleton', () => {
            expect(sqliteStorageService1).to.equal(sqliteStorageService2);
        });

    });

    function initializeStorageService() : SqlStorageService {
        return SqliteStorageService;
    }

});
