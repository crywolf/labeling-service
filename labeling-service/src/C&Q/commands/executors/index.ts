import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorSqlite';
import RemoveLabelExecutor from './RemoveLabelExecutorSqlite';
import CreateLabelRestrictionExecutor from './CreateLabelRestrictionExecutorSqlite';
import RemoveLabelRestrictionExecutor from './RemoveLabelRestrictionExecutorSqlite';

const commandExecutors = {
    CreateLabelRelationshipExecutor,
    RemoveLabelExecutor,
    CreateLabelRestrictionExecutor,
    RemoveLabelRestrictionExecutor
};

export default commandExecutors;
