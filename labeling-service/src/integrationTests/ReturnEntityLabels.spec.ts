import {initApp, request, expect, storageService} from '../lib/test/integration';
import {addLabel} from '../lib/test/util';
import Label from '../coreEntities/Label';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::ReturnEntityLabels route', () => {

    let db: SqlDatabase;

    const entityAId = '2';
    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;

    const entityBId = '3';
    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;
    let entityBLabel4: Label;

    const entityCId = '6';
    let entityCLabel1: Label;
    let entityCLabel2: Label;

    let entityALabel3DifferentOwner: Label;

    before(() => {
        return initApp()
            .then(() => {
                db = storageService.db;
            });
    });

    beforeEach(() => {
         return storageService.truncate()
            .then(() => {
                return insertLabels();
            });
    });

    describe('calling the route', () => {
        context('without any querystring parameters', () => {
            it('should return all labels of the entity', () => {
                return request
                    .get(`/owner/1/labeled-entities/${entityAId}/labels`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(4);
                        expect(body[0]).to.deep.equal({type: entityALabel1.type, value: entityALabel1.value});
                    });
            });
        });

        context('with complex querystring', () => {
            it('should return labels of specified entity with corresponding label types and label values', () => {
                const querystring = '?labelTypes=color,size&labelValues=black,big,small';

                return request
                    .get(`/owner/1/labeled-entities/${entityAId}/labels${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(2);

                        const label2 = {type: entityALabel2.type, value: entityALabel2.value};
                        const label4 = {type: entityALabel4.type, value: entityALabel4.value};

                        expect(body[0]).to.deep.equal(label2);
                        expect(body[1]).to.deep.equal(label4);
                    });
            });
        });
    });

    function insertLabels () {
        entityALabel1 = {
            ownerId: '1',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: '1',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityALabel3 = {
            ownerId: '1',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'someLabel',
            value: ''
        };
        entityALabel4 = {
            ownerId: '1',
            entityId: entityAId,
            entityType: 'EntityA',
            type: 'size',
            value: 'big'
        };

        entityBLabel1 = {
            ownerId: '1',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: '1',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: '1',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'color',
            value: 'black'
        };
        entityBLabel4 = {
            ownerId: '1',
            entityId: entityBId,
            entityType: 'EntityB',
            type: 'size',
            value: 'small'
        };

        entityCLabel1 = {
            ownerId: '1',
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'size',
            value: 'medium'
        };
        entityCLabel2 = {
            ownerId: '1',
            entityId: entityCId,
            entityType: 'EntityC',
            type: 'shape',
            value: 'square'
        };

        entityALabel3DifferentOwner = {
            ownerId: '99',
            entityId: '2',
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };

        return addLabel(db, entityALabel1)
            .then(() => {
                return addLabel(db, entityALabel2);
            })
            .then(() => {
                return addLabel(db, entityALabel3);
            })
            .then(() => {
                return addLabel(db, entityBLabel1);
            })
            .then(() => {
                return addLabel(db, entityBLabel2);
            })
            .then(() => {
                return addLabel(db, entityBLabel3);
            })
            .then(() => {
                return addLabel(db, entityCLabel1);
            })
            .then(() => {
                return addLabel(db, entityCLabel2);
            })
            .then(() => {
                return addLabel(db, entityALabel4);
            })
            .then(() => {
                return addLabel(db, entityBLabel4);
            })
            .then(() => {
                return addLabel(db, entityALabel3DifferentOwner);
            });
    }

});
