import Store from './Store';
import Label from '../../coreEntities/Label';

class MemoryStore implements Store {

    private storage: Set<Label> = new Set();

    public createLabelRelationship (label: Label): Promise<Label> {
        this.storage.add(label);
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

        const data = Array.from(this.storage).filter((label) => {
            if (labelTypes.length) {
                return (labelTypes.indexOf(label.type)) !== -1 && (label.ownerId === ownerId);
            } else {
                return label.ownerId === ownerId;
            }
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

        const data = Array.from(this.storage).filter((label) => {
            return (label.ownerId === ownerId) && (label.entityId === entityId);
        });
        return Promise.resolve(data);
    }

}

export default MemoryStore;
