const BaseComposite = require('../core/BaseComposite');
const {FAILURE, RUNNING} = require('../constants');

/**
 * Class Priority
 * @extends BaseComposite
 * @category Composites
 **/
class Priority extends BaseComposite {

    /**
     * @constructor
     * @param {Object}      params
     * @param {BaseNode[]}  params.children
     */
    constructor({children = [], name} = {}) {
        super({
            type: 'Priority',
            name,
            children
        });
    }

    /**
     * @override
     * @param {Context} context
     **/
    open(context) {
        context.blackboard.tree(context.tree).node(this).set('runningChild', 0);
    }

    /**
     * @override
     * @param {Context} context
     * @return {Constant}
     **/
    run(context) {
        const nodeBoard = context.blackboard.tree(context.tree).node(this);
        const child = nodeBoard.get('runningChild');
        for (let i = child; i < this.children.length; i++) {
            const status = this.children[i].tick(context);

            if (status !== FAILURE) {
                if (status === RUNNING) {
                    nodeBoard.set('runningChild', i);
                }
                return status;
            }
        }

        return FAILURE;
    }
}

module.exports = Priority;
