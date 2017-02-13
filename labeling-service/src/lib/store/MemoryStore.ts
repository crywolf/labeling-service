import Store from './Store';
import Label from '../../coreEntities/Label';

class MemoryStore implements Store {

    private storage: Array<Label> = [];

    public createLabelRelationship (label: Label): Promise<Label> {
        this.storage.push(label);
//        console.log('===>', this.storage);
        return Promise.resolve(label);
    }

    public removeLabel (entityId: number, labelTypes: Array<string> = [],
                        labelValues: Array<string> = []): Promise<Array<Label>> {
        let toDelete: Set<number|string>;
        const deletedLabels: Array<Label> = [];

        if (entityId) {
            if (labelTypes.length) {
                toDelete = new Set(labelTypes);
                this.storage = this.storage.filter((obj) => {
                    if (obj.entityId !== entityId) {
                        return true;
                    } else if (toDelete.has(obj.type)) {
                        deletedLabels.push(obj);
                        return false;
                    }
                });
            } else if (labelValues.length) {
                toDelete = new Set(labelValues);
                this.storage = this.storage.filter((obj) => {
                    if (obj.entityId !== entityId) {
                        return true;
                    } else if (toDelete.has(obj.value)) {
                        deletedLabels.push(obj);
                        return false;
                    }
                });
            } else {
                toDelete = new Set([entityId]);
                this.storage = this.storage.filter((obj) => {
                    if (obj.entityId !== entityId) {
                        return true;
                    } else if (toDelete.has(obj.entityId)) {
                        deletedLabels.push(obj);
                        return false;
                    }
                });
            }
        }

        return Promise.resolve(Array.from(deletedLabels));
    }

    public allEntitiesHavingLabel (ownerId: number, labelTypes: Array<string> = [],
                                   entityTypes: Array<string> = []): Promise<Array<Label>> {
//        console.log('*', ownerId, labelTypes)
        const data = this.storage.filter((label) => {
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
//        console.log('*', ownerId, entityId)
        const data = this.storage.filter((label) => {
            return (label.ownerId === ownerId) && (label.entityId === entityId);
        });
        return Promise.resolve(data);
    }

}

export default MemoryStore;
