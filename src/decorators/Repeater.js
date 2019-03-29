const Decorator = require('../core/BaseDecorator');
const {SUCCESS, ERROR, FAILURE} = require('../constants');

/**
 * Repeater is a decorator that repeats the tick signal until the child node
 * return `RUNNING` or `ERROR`. Optionally, a maximum number of repetitions
 * can be defined.
 *
 * @module b3
 * @class Repeater
 * @extends Decorator
 **/

module.exports = class Repeater extends Decorator {

    /**
     * Creates an instance of MaxTime.
     *
     * - **maxLoop** (*Integer*) Maximum number of repetitions. Default to -1 (infinite).
     * - **child** (*BaseNode*) The child node.
     *
     * @param {Object} params Object with parameters.
     * @param {Number} params.maxLoop Maximum number of repetitions. Default to -1 (infinite).
     * @param {BaseNode} params.child The child node.
     * @memberOf Repeater
     **/
    constructor({maxLoop = -1, name, child = null} = {}) {
        super({
            child,
            type: 'Repeater',
            name: name || `Repeat <maxLoop>x`,
            properties: {maxLoop: -1},
        });

        this.maxLoop = maxLoop;
    }

    /**
     * Open method.
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick) {
        tick.blackboard.set('i', 0, tick.tree.id, this.id);
    }

    /**
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     **/
    tick(tick) {
        if (!this.child) {
            return ERROR;
        }

        let i = tick.blackboard.get('i', tick.tree.id, this.id);
        let status = SUCCESS;

        if (this.maxLoop < 0 || i < this.maxLoop) {
            status = this.child._execute(tick);

            if (status === SUCCESS || status === FAILURE) {
                i++;
            }
        } else {
            return SUCCESS;
        }

        tick.blackboard.set('i', i, tick.tree.id, this.id);
        return status;
    }
};
