const BaseDecorator = require('../core/BaseDecorator');
const {FAILURE, SUCCESS, ERROR} = require('../constants');

/**
 * If one of sequence node failed, rewind runningChild to very first
 * @class Inverter
 * @extends BaseDecorator
 **/

module.exports = class Inverter extends BaseDecorator {

    /**
     * Creates an instance of Inverter.
     * @param {Object}   params
     * @param {BaseNode} params.child
     * @memberOf Inverter
     */
    constructor({child = null} = {}) {
        super({
            child,
            type: 'Inverter',
        });
    }

    /**
     * Context method.
     * @method run
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     **/
    run(context) {
        if (!this.child) {
            return ERROR;
        }

        let status = this.child.tick(context);

        if (status === FAILURE) {
            context.blackboard.set('runningChild', 0, context.tree.id, this.child.id);
        }

        return status;
    }
};
