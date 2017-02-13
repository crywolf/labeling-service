import Label from '../../coreEntities/Label';

interface Store {

    createLabelRelationship (label: Label): Promise<Label>;

    removeLabel (entityId: number, labelTypes: Array<string>, labelValues: Array<string>): Promise<Array<Label>>;

    allEntitiesHavingLabel (ownerId: number, labelTypes: Array<string>,
                                   entityTypes: Array<string>): Promise<Array<Label>>;

    entityLabels (
        ownerId: number,
        entityId: number,
        labelTypes: Array<string>,
        labelValues: Array<string>,
        entityTypes: Array<string>
    ): Promise<Array<Label>>;

}

export default Store;
