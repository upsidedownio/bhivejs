const BaseDecorator = require('../core/BaseDecorator');
const {RUNNING, ERROR} = require('../constants');

/**
 * Class RewindWhenRunning
 * If one of sequence node failed, rewind runningChild to very first
 * @extends BaseDecorator
 * @category Decorators
 **/
class RewindWhenRunning extends BaseDecorator {

    /**
     * Creates an instance of Inverter.
     * @constructor
     * @param {Object}   params
     * @param {BaseNode} params.child
     */
    constructor({child = null} = {}) {
        super({
            child,
            type: 'RewindWhenRunning',
        });
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

        let status = this.child.tick(context);

        if (status === RUNNING) {
            context.blackboard.tree(context.tree.id).node(this.child.id).set('runningChild', 0);
        }

        return status;
    }
}

module.exports = RewindWhenRunning;
