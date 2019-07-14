const BaseDecorator = require('../core/BaseDecorator');
const {FAILURE, SUCCESS, ERROR} = require('../constants');

/**
 * If one of sequence node failed, rewind runningChild to very first
 * @class RewindWhenFailure
 * @extends BaseDecorator
 **/

class RewindWhenFailure extends BaseDecorator {

    /**
     * Creates an instance of Inverter.
     * @param {Object}   params
     * @param {BaseNode} params.child
     * @memberOf RewindWhenFailure
     */
    constructor({child = null} = {}) {
        super({
            child,
            type: 'RewindWhenFailure',
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
            const nodeBoard = context.blackboard.tree(context.tree.id).node(this.child.id);
            context.logger.debug('rewind! ' + nodeBoard.get('runningChild') + ' to 0');
            nodeBoard.set('runningChild', 0);
        }

        return status;
    }
}

module.exports = RewindWhenFailure;
