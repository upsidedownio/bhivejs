const BaseComposite = require('../core/BaseComposite');
const {SUCCESS, RUNNING} = require('../constants');

/**
 * @class Sequence
 * @extends BaseComposite
 **/
module.exports = class Sequence extends BaseComposite {

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
     * @function open
     * @param {Context} context
     **/
    open(context) {
        context.blackboard.set('runningChild', 0, context.tree.id, this.id);
    }

    /**
     * @function run
     * @param {Context} context
     * @return {Constant}
     **/
    run(context) {
        const child = context.blackboard.get('runningChild', context.tree.id, this.id);
        for (let i = child; i < this.children.length; i++) {
            const status = this.children[i].tick(context);

            if (status !== SUCCESS) {
                if (status === RUNNING) {
                    context.blackboard.set('runningChild', i, context.tree.id, this.id);
                }
                return status;
            }
        }

        return SUCCESS;
    }
};
