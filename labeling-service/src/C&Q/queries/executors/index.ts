// TODO export automatically
import AllEntitiesHavingLabelExecutor from './AllEntitiesHavingLabelExecutorInMemory';
import EntityLabelsExecutor from './EntityLabelsExecutorInMemory';

import memoryStorage from '../../../lib/store/memoryStorage';

const allEntitiesHavingLabelExecutor = new AllEntitiesHavingLabelExecutor(memoryStorage);
const entityLabelsExecutor = new EntityLabelsExecutor(memoryStorage);

export default {
    AllEntitiesHavingLabel: allEntitiesHavingLabelExecutor,
    EntityLabels: entityLabelsExecutor
};
