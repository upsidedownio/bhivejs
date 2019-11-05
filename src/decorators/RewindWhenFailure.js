const BaseDecorator = require('../core/BaseDecorator');
const {FAILURE, ERROR} = require('../constants');

/**
 * Class RewindWhenFailure
 * If one of sequence node failed, rewind runningChild to very first
 * @extends BaseDecorator
 * @category Decorators
 **/
class RewindWhenFailure extends BaseDecorator {

    /**
     * Creates an instance of Inverter.
     * @param {Object}   params
     * @param {BaseNode} params.child
     */
    constructor({child = null} = {}) {
        super({
            child,
            type: 'RewindWhenFailure',
        });
    }

    /**
     * Context method.
     * @param {Context} context A run instance.
     * @return {NodeStatus} A state constant.
     **/
    run(context) {
        if (!this.child) {
            return ERROR;
        }

        let status = this.child.tick(context);

        if (status === FAILURE) {
            const nodeBoard = context.treeBoard.node(this.child.id);
            context.logger.debug('rewind! ' + nodeBoard.get('runningChild') + ' to 0');
            nodeBoard.set('runningChild', 0);
        }

        return status;
    }
}

module.exports = RewindWhenFailure;
