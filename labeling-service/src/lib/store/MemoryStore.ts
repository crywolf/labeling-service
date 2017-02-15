import Store from './Store';
import Label from '../../coreEntities/Label';

class MemoryStore implements Store {

    private storage: Set<Label>;

    constructor (storage: Set<Label>) {
        this.storage = storage;
    }

    public createLabelRelationship (label: Label): Promise<Label> {
        let unique: boolean = true;

        for (const storedLabel of this.storage) {
            if (this.deepEqual(label, storedLabel)) {
                unique = false;
            }
        }

        if (unique) {
            this.storage.add(label);
        }
        return Promise.resolve(label);
    }

    public removeLabel (entityId: number, labelTypes: Array<string> = [],
                        labelValues: Array<string> = []): Promise<Array<Label>> {
        let toDelete: Set<number|string>;
        const deletedLabels: Array<Label> = [];

        if (entityId) {
            if (labelTypes.length) {
                toDelete = new Set(labelTypes);
                this.storage.forEach((label) => {
                    if (label.entityId === entityId && toDelete.has(label.type)) {
                        deletedLabels.push(label);
                        this.storage.delete(label);
                    }
                });
            } else if (labelValues.length) {
                toDelete = new Set(labelValues);
                this.storage.forEach((label) => {
                    if (label.entityId === entityId && toDelete.has(label.value)) {
                        deletedLabels.push(label);
                        this.storage.delete(label);
                    }
                });
            } else {
                toDelete = new Set([entityId]);
                this.storage.forEach((label) => {
                    if (label.entityId === entityId && toDelete.has(label.entityId)) {
                        deletedLabels.push(label);
                        this.storage.delete(label);
                    }
                });
            }
        }

        return Promise.resolve(Array.from(deletedLabels));
    }

    public allEntitiesHavingLabel (ownerId: number, labelTypes: Array<string> = [],
                                   entityTypes: Array<string> = []): Promise<Array<Label>> {

        const data = Array.from(this.storage)
            .filter((label) => {
                return label.ownerId === ownerId;
            })
            .filter((label) => {
                if (labelTypes.length) {
                    return (labelTypes.indexOf(label.type) !== -1);
                }
                return true;
            })
            .filter((label) => {
                if (entityTypes.length) {
                    return (entityTypes.indexOf(label.entityType) !== -1);
                }
                return true;
            });

        return Promise.resolve(data);
    }

    public entityLabels (
        ownerId: number,
        entityId: number,
        labelTypes: Array<string> = [],
        labelValues: Array<string> = [],
        entityTypes: Array<string> = []
    ): Promise<any> {

        const data = Array.from(this.storage)
            .filter((label) => {
                return label.ownerId === ownerId;
            })
            .filter((label) => {
                return label.entityId === entityId;
            })
            .filter((label) => {
                if (labelTypes.length) {
                    return (labelTypes.indexOf(label.type) !== -1);
                }
                return true;
            });
        return Promise.resolve(data);
    }

    private deepEqual(x, y) {
    const ok = Object.keys;
    const tx = typeof x;
    const ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
            ok(x).length === ok(y).length &&
            ok(x).every((key) => this.deepEqual(x[key], y[key]))
        ) : (x === y);
}
}

export default MemoryStore;
