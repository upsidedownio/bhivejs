const _ = require('lodash');
const BaseNode = require('../core/BaseNode');
const {ACTION, RUNNING, SUCCESS, FAILURE, ERROR} = require('../constants');

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
            category: ACTION,
            type: type || 'AsyncAction',
            name: name,
            properties: _.assign(properties, {timeout: -1}),
        });

        this.run = run;
    }

    /**
     * reset timeout in milliseconds
     * if neither parameter and timeout property are not valid, unset the timeout
     * @param {number} [t] in milliseconds
     */
    updateTimeout(t) {
        if (this.deadline) {
            clearTimeout(this.deadline);
        }
        if (t || this.timeout !== -1) {
            this.deadline = setTimeout(() => {
                // console.info('Timeout on AsyncAction: ' + this.type);
                this.status = FAILURE;
            }, t || this.timeout);
        }
    }

    get timeout() {
        return this.properties.timeout;
    }

    set timeout(t) {
        this.properties.timeout = t;
        this.updateTimeout(this.properties.timeout);
        return t;
    }

    /**
     * @method _run
     * @override
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     * @protected
     **/
    _run(context) {
        super._run(context);
        try {
            const result = this.asyncRun(context);
            if (context.debug) {
                console.log(`run() result:\t${this.name}: ` + result);
            }
            return result;
        } catch (e) {
            context.logger.err(`failed to running AsyncAction: ${this.name}`, {err: e});
            return FAILURE;
        }
    }

    /**
     * @param {Context} context
     * @returns {*}
     */
    asyncRun(context) {
        const bb = context.blackboard;
        const l = context.logger;

        if (bb.get('isCalled', context.tree.id, this.id)) {
            return bb.get('status', context.tree.id, this.id);
        } else {
            bb.set('isCalled', true, context.tree.id, this.id);
        }

        this.updateTimeout();
        this.run(context)
            .then((result) => {
                let status = bb.get('status', context.tree.id, this.id);

                if (status !== RUNNING) {
                    console.log('run() resolved after timeout, the result gonna ignored');
                    status = FAILURE;
                    return;
                }
                if (result === SUCCESS || result === FAILURE) {
                    status = result;
                } else {
                    l.warn('run() of AsyncAction should return SUCCESS or FAILURE only');
                    status = ERROR;
                }

                if (result !== SUCCESS) {
                    l.warn(`AsyncAction ${this.type} ${this.name} has resolved with result ` + result);
                } else {
                    l.i(`AsyncAction ${this.type} ${this.name} has resolved with result ` + result);
                }
                bb.set('status', status, context.tree.id, this.id);
            })
            .catch((err) => {
                let status = bb.get('status', context.tree.id, this.id);

                if (status !== RUNNING) {
                    l.warn('run() resolved after timeout, the result gonna ignored');
                    return;
                }
                status = FAILURE;
                l.err(`Error on run() of ${this.type} ${this.name}`, {
                    err: err,
                    message: _.get(err, 'message')
                });

                bb.set('status', status, context.tree.id, this.id);
            });
        return bb.get('status', context.tree.id, this.id);
    }

    close(context) {
        context.blackboard.set('isCalled', false, context.tree.id, this.id);
    }
};
