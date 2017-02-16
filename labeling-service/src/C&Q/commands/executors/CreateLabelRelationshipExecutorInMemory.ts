import Label from '../../../coreEntities/Label';
import CommandExecutorInMemory from '../../../coreEntities/CommandExecutorInMemory';

class CreateLabelRelationshipExecutorInMemory extends CommandExecutorInMemory {

    public execute (label: Label): Promise<Label> {
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

    private deepEqual (x, y) {
        const ok = Object.keys;
        const tx = typeof x;
        const ty = typeof y;
        return x && y && tx === 'object' && tx === ty ? (
                ok(x).length === ok(y).length &&
                ok(x).every((key) => this.deepEqual(x[key], y[key]))
            ) : (x === y);
    }

}

export default CreateLabelRelationshipExecutorInMemory;
