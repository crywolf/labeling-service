import {initApp, request, expect, storageService} from '../lib/test/integration';
import {countRows, addLabel, testConfig} from '../lib/test/util';
import Label from '../coreEntities/Label';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::CreateLabelRelationship route', () => {

    let db: SqlDatabase;

    let entityA200Label1: Label;

    before(() => {
        entityA200Label1 = {
            ownerId: 1,
            entityId: 200,
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
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
        context('in case entityType and entityId is unique', () => {
            it('should attach label to entity', () => {
                return request
                    .post('/owner/1/label-relationships')
                    .send(entityA200Label1)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

        context('in case label is completely the same (not unique)', () => {
            beforeEach(() => {
                return addLabel(db, entityA200Label1);
            });

            it('should not do anything and return 200 OK', () => {
                return request
                    .post('/owner/1/label-relationships')
                    .send(entityA200Label1)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.empty;
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(1);
                            });
                    });
            });
        });

    });

});
