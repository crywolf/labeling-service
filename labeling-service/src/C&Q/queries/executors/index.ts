// import ReturnAllLabeledEntitiesExecutor from './ReturnAllLabeledEntitiesExecutorInMemory';
import ReturnAllLabeledEntitiesExecutor from './ReturnAllLabeledEntitiesExecutorSqlite';
import ReturnEntityLabelsExecutor from './ReturnEntityLabelsExecutorInMemory';

const queryExecutors = {
    ReturnAllLabeledEntitiesExecutor,
    ReturnEntityLabelsExecutor
};

export default queryExecutors;
