import {expect} from 'chai';
import RestrictionHasher from './RestrictionHasher';
import Restriction from './Restriction';

describe('RestrictionHasher', () => {
    let hasher: RestrictionHasher;

    const restriction: Restriction = {
        ownerId: 1,
        labelType: 'color',
        entityType: 'entityA'
    };

    describe('with "md5" (default) algorithm', () => {
        beforeEach(() => {
            hasher = new RestrictionHasher();
        });
        it('returns correct hash', () => {
            return hasher.createHash(restriction)
                .then((hash) => {
                    expect(hash).to.be.equal('28966d210123a442b9b292363f505a69');
                });
        });
    });

    describe('with "sha256" algorithm', () => {
        beforeEach(() => {
            hasher = new RestrictionHasher('sha256');
        });
        it('returns correct hash', () => {
            return hasher.createHash(restriction)
                .then((hash) => {
                    expect(hash).to.be.equal('3c4ab6e4b1779f13e15652cacbce03729680a9ce585f06e39bfeb7d2a776c4a3');
                });
        });
    });
});
