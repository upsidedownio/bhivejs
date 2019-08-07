const BaseDecorator = require('../core/BaseDecorator');
const {SUCCESS, ERROR, FAILURE, RUNNING} = require('../constants');

/**
 * Class UntilSuccess
 * @extends BaseDecorator
 * @category Decorators
 */
class UntilSuccess extends BaseDecorator {

    /**
     * Creates an instance of UntilSuccess.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @constructor
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode} params.child The child node.
     **/
    constructor({maxLoop = -1, child = null} = {}) {
        super({
            child,
            type: 'UntilSuccess',
            name: 'Until Success',
            properties: {maxLoop: -1},
        });

        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @param {Context} context A run instance.
     **/
    open(context) {
        context.blackboard.tree(context.tree.id).node(this.id).set('i', 0);
    }

    /**
     * Context method.
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     **/
    run(context) {
        if (!this.child) {
            return ERROR;
        }

        let i = context.blackboard.tree(context.tree.id).node(this.id).get('i');
        let childStatus = RUNNING;

        if (this.maxLoop < 0 || i < this.maxLoop) {
            childStatus = this.child.tick(context);

            if (childStatus === FAILURE) {
                i++;
            } else if (childStatus === RUNNING) {
                return RUNNING;
            } else if (childStatus === SUCCESS) {
                // end condition
                return SUCCESS;
            } else {
                context.logger.DEBUG_err('UNKNOWN child status under repeatUntilSuccess :' + childStatus);
                return ERROR;
            }

        } else if (i >= this.maxLoop) {
            return SUCCESS;
        }

        context.blackboard.tree(context.tree.id).node(this.id).set('i', i);
        return childStatus;
    }
}

module.exports = UntilSuccess;
