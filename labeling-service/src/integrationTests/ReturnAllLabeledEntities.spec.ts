import {initApp, request, expect, storageService} from '../lib/test/integration';
import {addLabel} from '../lib/test/util';
import Label from '../coreEntities/Label';
import SqlDatabase from '../coreEntities/SqlDatabase';

describe('Integration::ReturnAllLabeledEntities route', () => {

    let db: SqlDatabase;

    let entityALabel1: Label;
    let entityALabel2: Label;
    let entityALabel3: Label;
    let entityALabel4: Label;

    let entityBLabel1: Label;
    let entityBLabel2: Label;
    let entityBLabel3: Label;
    let entityBLabel4: Label;

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
                return insertRestrictions();
            });
    });

    describe('calling the route', () => {
        context('without any querystring parameters', () => {
            it('should return all labeled entities of a corresponding owner', () => {
                const ownerId = 1;

                return request
                    .get(`/owners/${ownerId}/labeled-entities`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(3);

                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                        const entityC = {entityId: entityCLabel1.entityId, entityType: entityCLabel1.entityType};

                        expect(body[0]).to.deep.equal(entityA);
                        expect(body[1]).to.deep.equal(entityB);
                        expect(body[2]).to.deep.equal(entityC);
                    });
            });
        });

        context('more label types joined with "," and more entity types', () => {
            it('should return labeled entities with corresponding label types and entity types', () => {
                const ownerId = 1;
                const querystring = '?labelTypes=color,shape&entityTypes=EntityA,EntityC';

                return request
                    .get(`/owners/${ownerId}/labeled-entities${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(2);

                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        const entityC = {entityId: entityCLabel1.entityId, entityType: entityCLabel1.entityType};

                        expect(body[0]).to.deep.equal(entityA);
                        expect(body[1]).to.deep.equal(entityC);
                    });
            });
        });

        describe('more label types joined with ";" and more entity types', () => {
            it('should return labeled entities with corresponding label types and entity types', () => {
                const ownerId = 1;
                const querystring = '?labelTypes=color;size&entityTypes=EntityB,EntityA,EntityC';

                return request
                    .get(`/owners/${ownerId}/labeled-entities${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(2);

                        const entityA = {entityId: entityALabel1.entityId, entityType: entityALabel1.entityType};
                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};

                        expect(body[0]).to.deep.equal(entityA);
                        expect(body[1]).to.deep.equal(entityB);
                    });
            });
        });

        context('label type and more label values', () => {
            it('should return labeled entities with corresponding label type and label values', () => {
                const ownerId = 1;
                const querystring = '?labelTypes=size&labelValues=small,medium';

                return request
                    .get(`/owners/${ownerId}/labeled-entities${querystring}`)
                    .then((res) => {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;

                        const body = res.body;
                        expect(body).to.be.an('Array');
                        expect(body).to.have.lengthOf(2);

                        const entityB = {entityId: entityBLabel1.entityId, entityType: entityBLabel1.entityType};
                        const entityC = {entityId: entityCLabel1.entityId, entityType: entityCLabel1.entityType};

                        expect(body[0]).to.deep.equal(entityB);
                        expect(body[1]).to.deep.equal(entityC);
                    });
            });
        });

    });

    function insertRestrictions () {
        entityALabel1 = {
            ownerId: '1',
            entityId: '2',
            entityType: 'EntityA',
            type: 'color',
            value: 'blue'
        };
        entityALabel2 = {
            ownerId: '1',
            entityId: '2',
            entityType: 'EntityA',
            type: 'color',
            value: 'black'
        };
        entityALabel3 = {
            ownerId: '1',
            entityId: '2',
            entityType: 'EntityA',
            type: 'someLabel',
            value: ''
        };
        entityALabel4 = {
            ownerId: '1',
            entityId: '2',
            entityType: 'EntityA',
            type: 'size',
            value: 'big'
        };

        entityBLabel1 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'EntityB',
            type: 'height',
            value: '3'
        };
        entityBLabel2 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'EntityB',
            type: 'width',
            value: '6'
        };
        entityBLabel3 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'EntityB',
            type: 'color',
            value: 'black'
        };
        entityBLabel4 = {
            ownerId: '1',
            entityId: '3',
            entityType: 'EntityB',
            type: 'size',
            value: 'small'
        };

        entityCLabel1 = {
            ownerId: '1',
            entityId: '6',
            entityType: 'EntityC',
            type: 'size',
            value: 'medium'
        };
        entityCLabel2 = {
            ownerId: '1',
            entityId: '6',
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
