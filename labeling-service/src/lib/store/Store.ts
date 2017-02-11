import Label from '../../coreEntities/Label';

interface Store {

    labelEntity (label: Label): Promise<any>;

    allEntitiesHavingLabel (ownerId: number, labelTypes: Array<string>,
                                   entityTypes: Array<string>): Promise<any>;

    entityLabels (
        ownerId: number,
        entityId: number,
        labelTypes: Array<string>,
        labelValues: Array<string>,
        entityTypes: Array<string>
    ): Promise<any>;

}

export default Store;
