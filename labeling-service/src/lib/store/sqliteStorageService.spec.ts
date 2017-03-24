import {expect} from 'chai';
import SqlStorageService from './SqlStorageService';
import sqliteStorageService from './sqliteStorageService';

describe('sqliteStorageService', () => {

    let sqliteStorageService1: SqlStorageService;
    let sqliteStorageService2: SqlStorageService;

    beforeEach(() => {
        sqliteStorageService1 = initializeStorageService();
        sqliteStorageService2 = initializeStorageService();
    });

    describe('when asked to instantiate', () => {

        it('should return a Singleton', () => {
            expect(sqliteStorageService1).to.equal(sqliteStorageService2);
        });

    });

    function initializeStorageService (): SqlStorageService {
        return sqliteStorageService;
    }

});
