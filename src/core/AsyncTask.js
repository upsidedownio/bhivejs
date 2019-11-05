const BaseNode = require('../core/BaseNode');
const {TASK, RUNNING, ERROR} = require('../constants');

/**
 * @typedef {object} workerConfig
 * @property {string} taskDir
 * @property {string} logDir
 * @property {string} uuid
 */

/**
 * Class AsyncTask
 * @extends BaseNode
 */
class AsyncTask extends BaseNode {

    /**
     * @constructor
     * @param {object}      params={}
     * @param {string}     [params.type='AsyncTask']
     * @param {string}     [params.name=params.type]
     * @param {object}     [params.properties]
     * @param {function}    params.run
     */
    constructor({type = 'AsyncTask', name, description, properties, run} = {}) {
        super({
            category: TASK,
            type,
            name: name || type,
            description,
            properties
        });
        /** @type {function} */
        this.run = run;
    }

    /**
     * @override
     * @param {Context} context
     */
    open(context) {
        super.open(context);
        const nodeBoard = context.treeBoard.node(this);
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
     * @override
     * @param {Context} context A run instance.
     * @return {NodeStatus} A state constant.
     * @protected
     **/
    _run(context) {
        const nodeBoard = context.blackboard.tree(context.behaviorTree).node(this);
        return nodeBoard.get('asyncStatus');
    }

    /**
     * @param context
     */
    close(context) {
        const nodeBoard = context.blackboard.tree(context.behaviorTree).node(this);
        context.logger.debug(`success asyncTask:${this.name} with status: ` + nodeBoard.get('asyncStatus'));
        nodeBoard.unset('asyncStatus');
    }
}

module.exports = AsyncTask;
