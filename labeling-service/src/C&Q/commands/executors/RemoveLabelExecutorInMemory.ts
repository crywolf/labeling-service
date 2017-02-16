import Label from '../../../coreEntities/Label';
import CommandExecutorInMemory from '../../../coreEntities/CommandExecutorInMemory';

class RemoveLabelExecutorInMemory extends CommandExecutorInMemory {

    public execute (entityId: number, labelTypes: Array<string> = [],
                    labelValues: Array<string> = []): Promise<Array<Label>> {

        let toDelete: Set<number|string>;
        const deletedLabels: Array<Label> = [];

        if (entityId) {
            if (labelTypes.length && labelValues.length) {
                toDelete = new Set([...labelTypes, ...labelValues]);
                this.storage.forEach((label) => {
                    if (label.entityId === entityId && toDelete.has(label.type) && toDelete.has(label.value)) {
                        deletedLabels.push(label);
                        this.storage.delete(label);
                    }
                });
            } else {
                if (labelTypes.length) {
                    toDelete = new Set(labelTypes);
                    this.storage.forEach((label) => {
                        if (label.entityId === entityId && toDelete.has(label.type)) {
                            deletedLabels.push(label);
                            this.storage.delete(label);
                        }
                    });
                }
                if (labelValues.length) {
                    toDelete = new Set(labelValues);
                    this.storage.forEach((label) => {
                        if (label.entityId === entityId && toDelete.has(label.value)) {
                            deletedLabels.push(label);
                            this.storage.delete(label);
                        }
                    });
                }
                if (!labelTypes.length && !labelValues.length) {
                    toDelete = new Set([entityId]);
                    this.storage.forEach((label) => {
                        if (label.entityId === entityId && toDelete.has(label.entityId)) {
                            deletedLabels.push(label);
                            this.storage.delete(label);
                        }
                    });
                }
            }
        }

        return Promise.resolve(Array.from(deletedLabels));
    }

}

export default RemoveLabelExecutorInMemory;
