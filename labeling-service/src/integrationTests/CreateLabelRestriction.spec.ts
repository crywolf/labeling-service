import {initApp, request, expect} from '../lib/test/integration';
import {countRows, addRestriction} from '../lib/test/util';
import Restriction from '../coreEntities/Restriction';
import storageService from '../lib/store/sqliteStorageService';
import {Database} from 'sqlite';

import config from '../config';
const testConfig = config.sqlite;

describe('CreateLabelRestriction route', () => {

    let db: Database;

    let entityARestriction1: Restriction;
    const whateverHash = '56d2f7e59b5b4716a88ca5c4ddc0791d';

    before(() => {
        entityARestriction1 = {
            ownerId: 1,
            labelType: 'color',
            entityType: 'entityA'
        };

        return initApp()
            .then(() => {
                db = storageService.db;
            });
    });

    beforeEach(() => {
        return storageService.truncate();
    });

    describe('calling the route', () => {
        describe('in case labelType and entityType is unique', () => {
            it('should add restriction', () => {
                return request
                    .post('/owner/1/label-restrictions')
                    .send(entityARestriction1)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.restrictionsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

        describe('in case label restriction is completely the same (not unique)', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash);
            });

            it('should not do anything and return 200 OK', () => {
                return request
                    .post('/owner/1/label-restrictions')
                    .send(entityARestriction1)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.restrictionsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

    });

});
