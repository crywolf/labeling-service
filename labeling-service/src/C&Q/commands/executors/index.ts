import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorSqlite';
import RemoveLabelExecutor from './RemoveLabelExecutorSqlite';
import CreateLabelRestrictionExecutor from './CreateLabelRestrictionExecutorSqlite';

const commandExecutors = {
    CreateLabelRelationshipExecutor,
    RemoveLabelExecutor,
    CreateLabelRestrictionExecutor
};

export default commandExecutors;
