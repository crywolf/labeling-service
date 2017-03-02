import Restriction from './Restriction';
import * as crypto from 'crypto';

class RestrictionHasher {

    private algorithm: string;

    constructor (algorithm: string = 'md5') {
        this.algorithm = algorithm;
    }

    public createHash (restriction: Restriction): Promise<string> {
        const hash = crypto.createHash(this.algorithm);
        let data = '';

        return new Promise((resolve, reject) => {
            hash
                .on('readable', () => {
                    const chunk = hash.read() as Buffer;
                    if (chunk) {
                        data += chunk.toString('hex');
                    }
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (err) => {
                    reject(err);
                });

            hash.write(restriction.ownerId + restriction.labelType + restriction.entityType);
            hash.end();
        });
    }

}

export default RestrictionHasher;
