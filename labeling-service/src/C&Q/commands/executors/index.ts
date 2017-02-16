// TODO export automatically
import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorInMemory';
import RemoveLabelExecutor from './RemoveLabelExecutorInMemory';

import memoryStorage from '../../../lib/store/memoryStorage';

const createLabelRelationshipExecutor = new CreateLabelRelationshipExecutor(memoryStorage);
const removeLabelExecutor = new RemoveLabelExecutor(memoryStorage);

export default {
    CreateLabelRelationship: createLabelRelationshipExecutor,
    RemoveLabel: removeLabelExecutor
};
