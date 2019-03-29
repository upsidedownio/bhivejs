const BaseComposite = require('../core/BaseComposite');
const {FAILURE, RUNNING} = require('../constants');

/**
 * @class Priority
 * @extends BaseComposite
 **/
module.exports = class Priority extends BaseComposite {

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
     * @function open
     * @param {Tick} tick
     **/
    open(tick) {
        tick.blackboard.set('runningChild', 0, tick.tree.id, this.id);
    }

    /**
     * @function tick
     * @param {Tick} tick
     * @return {Constant}
     **/
    tick(tick) {
        const child = tick.blackboard.get('runningChild', tick.tree.id, this.id);
        for (let i = child; i < this.children.length; i++) {
            const status = this.children[i]._execute(tick);

            if (status !== FAILURE) {
                if (status === RUNNING) {
                    tick.blackboard.set('runningChild', i, tick.tree.id, this.id);
                }
                return status;
            }
        }

        return FAILURE;
    }
};
