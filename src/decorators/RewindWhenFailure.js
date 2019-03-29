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
     * Tick method.
     * @method tick
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     **/
    tick(tick) {
        if (!this.child) {
            return ERROR;
        }

        let status = this.child.execute(tick);

        if (status === FAILURE) {
            tick.blackboard.set('runningChild', 0, tick.tree.id, this.child.id);
        }

        return status;
    }
};
