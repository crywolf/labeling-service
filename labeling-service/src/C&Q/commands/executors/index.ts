// import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorInMemory';
import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorSqlite';
import RemoveLabelExecutor from './RemoveLabelExecutorInMemory';

const commandExecutors = {
    CreateLabelRelationshipExecutor,
    RemoveLabelExecutor
};

export default commandExecutors;
