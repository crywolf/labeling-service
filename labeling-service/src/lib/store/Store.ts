import Label from '../../coreEntities/Label';

interface Store {

    createLabelRelationship (label: Label): Promise<any>;

    removeLabel (entityId: number, labelTypes: Array<string>, labelValues: Array<string>): Promise<any>;

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
