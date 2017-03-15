import {initApp, request, expect, storageService} from '../lib/test/integration';
import {countRows, addRestriction, testConfig} from '../lib/test/util';
import Restriction from '../coreEntities/Restriction';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::CreateLabelRestriction route', () => {

    let db: SqlDatabase;

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
        context('in case labelType and entityType is unique', () => {
            it('should add restriction', () => {
                return request
                    .post('/owner/1/label-restrictions')
                    .send(entityARestriction1)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.db.restrictionsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

        context('in case label restriction is completely the same (not unique)', () => {
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
                        return countRows(db, testConfig.db.restrictionsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

    });

});
