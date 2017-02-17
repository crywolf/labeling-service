import {expect} from 'chai';
import QueryBuilder from './QueryBuilder';
import Query from './Query';
import memoryStorage from '../lib/store/memoryStorage';

describe('QueryBuilder', () => {
    let builder: QueryBuilder;

    beforeEach(() => {
        builder = new QueryBuilder(memoryStorage);
    });

    describe('#quieries', () => {
        it('returns array of Query instances', () => {
            const queries = builder.queries;
            expect(queries).to.be.a('Array');
            queries.forEach((query) => {
                expect(query).to.be.instanceOf(Query);
                expect(query).to.have.property('executor');
            });
        });
    });
});
