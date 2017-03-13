import CreateLabelRelationshipExecutor from './CreateLabelRelationshipExecutorSql';
import RemoveLabelExecutor from './RemoveLabelExecutorSql';
import CreateLabelRestrictionExecutor from './CreateLabelRestrictionExecutorSql';
import RemoveLabelRestrictionExecutor from './RemoveLabelRestrictionExecutorSql';

const commandExecutors = {
    CreateLabelRelationshipExecutor,
    RemoveLabelExecutor,
    CreateLabelRestrictionExecutor,
    RemoveLabelRestrictionExecutor
};

export default commandExecutors;
