const _ = require('lodash');
const BaseNode = require('../core/BaseNode');
const {TASK, RUNNING, SUCCESS, FAILURE, ERROR} = require('../constants');

/**
 * @typedef {object} workerConfig
 * @property {string} taskDir
 * @property {string} logDir
 * @property {string} uuid
 */
module.exports = class AsyncTask extends BaseNode {

    /**
     * @constructor
     */
    constructor({type = 'AsyncAction', name, properties, run} = {}) {
        /**
         * @member {string} type
         */
        super({
            category: TASK,
            type,
            name: name,
            properties
        });

        this.run = run;
    }

    /**
     * @override
     * @param {Context} context
     */
    open(context) {
        super.open(context);
        const nodeBoard = context.blackboard.tree(context.tree).node(this);
        nodeBoard.set('asyncStatus', RUNNING);
        this.run(context)
            .then((result) => {
                nodeBoard.set('asyncStatus', result);
            })
            .catch((err) => {
                context.logger.err(`Failed to running AsyncTask ${this.name}` +
                    `\n${err.message}\n${err.stack}`);
                nodeBoard.set('asyncStatus', ERROR);
            })
    }

    /**
     * @method _run
     * @override
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     * @protected
     **/
    _run(context) {
        const nodeBoard = context.blackboard.tree(context.tree).node(this);
        return nodeBoard.get('asyncStatus');
    }

    close(context) {
        const nodeBoard = context.blackboard.tree(context.tree).node(this);
        context.logger.debug(`success asyncTask:${this.name} with status`, nodeBoard.get('asyncStatus'));
        nodeBoard.clear('asyncStatus');
    }
};
