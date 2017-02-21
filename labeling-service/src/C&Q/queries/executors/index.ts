// import AllEntitiesHavingLabelExecutor from './AllEntitiesHavingLabelExecutorInMemory';
import AllEntitiesHavingLabelExecutor from './AllEntitiesHavingLabelExecutorSqlite';
import EntityLabelsExecutor from './EntityLabelsExecutorInMemory';

const queryExecutors = {
    AllEntitiesHavingLabelExecutor,
    EntityLabelsExecutor
};

export default queryExecutors;
