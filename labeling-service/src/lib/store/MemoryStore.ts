import Store from './Store';
import Label from '../../coreEntities/Label';

class MemoryStore implements Store {

    private storage: Array<Label> = [];

    public createLabelRelationship (label: Label) {
        this.storage.push(label);
//        console.log('===>', this.storage);
        return new Promise((resolve) => resolve());
    }

    public removeLabel (entityId: number, labelTypes: Array<string>, labelValues: Array<string>): Promise<any> {
        let toDelete;

        if (entityId) {
            if (labelTypes.length) {
                toDelete = new Set(labelTypes);
                this.storage = this.storage.filter((obj) => {
                    if (obj.entityId !== entityId) {
                        return true;
                    }
                    return !toDelete.has(obj.type);
                });
            } else if (labelValues.length) {
                toDelete = new Set(labelValues);
                this.storage = this.storage.filter((obj) => {
                    if (obj.entityId !== entityId) {
                        return true;
                    }
                    return !toDelete.has(obj.value);
                });
            } else {
                toDelete = new Set([entityId]);
                this.storage = this.storage.filter((obj) => !toDelete.has(obj.entityId));
            }
        }

        return new Promise((resolve) => resolve());
    }

    public allEntitiesHavingLabel (ownerId: number, labelTypes: Array<string>,
                                   entityTypes: Array<string>): Promise<any> {
//        console.log('*', ownerId, labelTypes)
        const data = this.storage.filter((label) => {
            return (labelTypes.indexOf(label.type)) !== -1 && (label.ownerId === ownerId);
        });
        return new Promise((resolve) => resolve(data));
    }

    public entityLabels (
        ownerId: number,
        entityId: number,
        labelTypes: Array<string>,
        labelValues: Array<string>,
        entityTypes: Array<string>
    ): Promise<any> {
//        console.log('*', ownerId, entityId)
        const data = this.storage.filter((label) => {
            return (label.ownerId === ownerId) && (label.entityId === entityId);
        });
        return new Promise((resolve) => resolve(data));
    }

}

export default MemoryStore;
