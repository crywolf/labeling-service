import {initApp, request, expect, storageService} from '../lib/test/integration';
import {countRows, addLabel, testConfig, addRestriction} from '../lib/test/util';
import Label from '../coreEntities/Label';
import Restriction from '../coreEntities/Restriction';
import SqlDatabase from '../coreEntities/SqlDatabase';
import * as sinon from 'sinon';

describe('Integration::CreateLabelRelationship route', () => {

    let db: SqlDatabase;

    let entityALabel1: Label;
    let labelPayload;

    let entityARestriction1: Restriction;
    const whateverHash = '35r2f7e59b5b4716a88ca5c4ddc07ooe';

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

        entityARestriction1 = {
            ownerId: '001',
            labelType: 'color'
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
                    .post('/owners/001/label-relationships')
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
                    .post('/owners/001/label-relationships')
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

        context('in case restriction exists', () => {
            beforeEach(() => {
                return addRestriction(db, entityARestriction1, whateverHash);
            });

            it('should not attach label and return 422 Unprocessable entity', () => {
                return request
                    .post('/owners/001/label-relationships')
                    .send(labelPayload)
                    .catch((err) => {
                        const res = err.response;
                        expect(res).to.have.status(422);
                        expect(res.body).to.deep.equal({
                            code: 'UnprocessableEntityError',
                            message: 'Forbidden label type because of restriction!'
                        });
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(0);
                            });
                    });
            });
        });

        context('in case of unexpected database error', () => {
            let runMethod;
            beforeEach(() => {
                runMethod = sinon.stub(db, 'run').returns(Promise.reject(new Error('Some SQL error')));
            });

            afterEach(() => {
                runMethod.restore();
            });

            it('should return 500 InternalServerError', () => {
                return request
                    .post('/owners/001/label-relationships')
                    .send(labelPayload)
                    .catch((err) => {
                        const res = err.response;
                        expect(res).to.have.status(500);
                        expect(res.body).to.deep.equal({
                            code: 'InternalServerError',
                            message: 'Something went wrong!'
                        });
                        return countRows(db, testConfig.db.labelsTable)
                            .then((count) => {
                                expect(count).to.equal(0);
                            });
                    });
            });
        });

    });

});
