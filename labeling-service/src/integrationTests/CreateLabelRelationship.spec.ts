import {initApp, request, expect, storageService} from '../lib/test/integration';
import {countRows, addLabel, testConfig} from '../lib/test/util';
import Label from '../coreEntities/Label';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::CreateLabelRelationship route', () => {

    let db: SqlDatabase;

    let entityALabel1: Label;
    let labelPayload;

    before(() => {
        entityALabel1 = {
            ownerId: '001',
            entityId: '00200',
            entityType: 'entityA',
            type: 'color',
            value: 'blue'
        };

        labelPayload = {
            ownerId: entityALabel1.ownerId,
            entityId: entityALabel1.entityId,
            entityType: entityALabel1.entityType,
            labelType: entityALabel1.type,
            labelValue: entityALabel1.value
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
                    .post('/owner/001/label-relationships')
                    .send(labelPayload)
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
                return addLabel(db, entityALabel1);
            });

            it('should not do anything and return 200 OK', () => {
                return request
                    .post('/owner/001/label-relationships')
                    .send(labelPayload)
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
