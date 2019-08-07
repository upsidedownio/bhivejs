const BaseComposite = require('../core/BaseComposite');
const {SUCCESS, RUNNING} = require('../constants');

/**
 * Class Sequence
 * @extends BaseComposite
 * @category Composites
 **/
class Sequence extends BaseComposite {

    /**
     * @constructor
     * @param {Object}      params
     * @param {BaseNode[]}  params.children
     */
    constructor({children = [], name} = {}) {
        super({
            type: 'Sequence',
            name,
            children
        });
    }

    /**
     * @override
     * @param {Context} context
     **/
    open(context) {
        context.blackboard.tree(context.tree.id).node(this.id).set('runningChild', 0);
    }

    /**
     * @override
     * @param {Context} context
     * @return {Constant}
     **/
    run(context) {
        const nodeBoard = context.blackboard.tree(context.tree.id).node(this.id);
        const child = nodeBoard.get('runningChild');
        for (let i = child; i < this.children.length; i++) {
            const status = this.children[i].tick(context);

            if (status !== SUCCESS) {
                if (status === RUNNING) {
                    nodeBoard.set('runningChild', i);
                }
                return status;
            }
        }

        return SUCCESS;
    }
}

module.exports = Sequence;
