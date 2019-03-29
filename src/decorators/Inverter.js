const BaseDecorator = require('../core/BaseDecorator');
const {FAILURE, SUCCESS, ERROR} = require('../constants');

/**
 * Invert the result of the child
 * child (return SUCCESS) --> return FAILURE
 * child (return FAILURE) --> return SUCCESS
 * child (return RUNNING) --> return RUNNING
 *
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

        if (status === SUCCESS) {
            status = FAILURE;
        } else if (status === FAILURE) {
            status = SUCCESS;
        }

        return status;
    }
};
