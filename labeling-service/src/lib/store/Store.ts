import Label from '../../coreEntities/Label';

class Store {

    private storage: Array<Label> = [];

    public labelEntity (label: Label): Promise<any> {
        this.storage.push(label);
//        console.log('===>', this.storage);
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

export default Store;
