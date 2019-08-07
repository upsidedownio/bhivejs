const Decorator = require('../core/BaseDecorator');
const {SUCCESS, ERROR, FAILURE} = require('../constants');

/**
 * Class repeating a child.
 *
 * Repeater is a decorator that repeats the run signal until the child node
 * return `RUNNING` or `ERROR`. Optionally, a maximum number of repetitions
 * can be defined.
 * @extends Decorator
 * @category Decorators
 **/
class Repeater extends Decorator {

    /**
     * Creates an instance of MaxTime.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {Object} params           - Object with parameters.
     * @param {Number} [params.maxLoop=-1 (infinite)]   - Maximum number of repetitions.
     * @param {BaseNode} params.child The child node.
     **/
    constructor({maxLoop = -1, name, child = null} = {}) {
        super({
            child,
            type: 'Repeater',
            name: name || `Repeat <maxLoop>x`,
            properties: {maxLoop: -1},
        });

        /** @type {number} */
        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @param {Context} context A run instance.
     * @returns {void}
     **/
    open(context) {
        context.blackboard.tree(context.tree.id).node(this.id).set('i', 0);
    }

    /**
     * Context method.
     * @param {Context} context A run instance.
     **/
    run(context) {
        if (!this.child) {
            return ERROR;
        }

        let i = context.blackboard.tree(context.tree.id).node(this.id).get('i');
        let status = SUCCESS;

        if (this.maxLoop < 0 || i < this.maxLoop) {
            status = this.child.tick(context);

            if (status === SUCCESS || status === FAILURE) {
                i++;
            }
        } else {
            return SUCCESS;
        }

        context.blackboard.tree(context.tree.id).node(this.id).set('i', i);
        return status;
    }
}

module.exports = Repeater;
