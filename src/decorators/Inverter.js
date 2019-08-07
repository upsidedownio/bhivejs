const BaseDecorator = require('../core/BaseDecorator');
const {FAILURE, SUCCESS, ERROR} = require('../constants');

/**
 * Class Invert the result of the child
 *
 * if child returns `SUCCESS` --> Inverter returns `FAILURE`
 * if child returns `FAILURE` --> Inverter returns `SUCCESS`
 * if child returns `RUNNING` --> Inverter returns `RUNNING`
 *
 * @category Decorators
 * @extends BaseDecorator
 **/
class Inverter extends BaseDecorator {

    /**
     * Creates an instance of Inverter.
     * @constructor
     * @param {Object}   params
     * @param {BaseNode} params.child
     */
    constructor({child = null} = {}) {
        super({
            child,
            type: 'Inverter',
        });
    }

    /**
     * Context method.
     * @override
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     **/
    run(context) {
        if (!this.child) {
            return ERROR;
        }

        let status = this.child.tick(context);

        if (status === SUCCESS) {
            status = FAILURE;
        } else if (status === FAILURE) {
            status = SUCCESS;
        }

        return status;
    }
}

module.exports = Inverter;
