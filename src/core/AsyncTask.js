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
     * @method _tick
     * @override
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     * @protected
     **/
    _tick(tick) {
        super._tick(tick);
        try {
            const result = this.asyncTick(tick);
            if (tick.debug) {
                console.log(`tick result:\t${this.name}: ` + result);
            }
            return result;
        } catch (e) {
            tick.logger.err(`failed to running AsyncAction: ${this.name}`, {err: e});
            return FAILURE;
        }
    }

    /**
     * @param {Tick} tick
     * @returns {*}
     */
    asyncTick(tick) {
        const bb = tick.blackboard;
        const l = tick.logger;

        if (bb.get('isCalled', tick.tree.id, this.id)) {
            return bb.get('status', tick.tree.id, this.id);
        } else {
            bb.set('isCalled', true, tick.tree.id, this.id);
        }

        this.updateTimeout();
        this.run(tick)
            .then((result) => {
                let status = bb.get('status', tick.tree.id, this.id);

                if (status !== RUNNING) {
                    console.log('run() resolved after timeout, the result gonna ignored');
                    status = FAILURE;
                    return;
                }
                if (result === SUCCESS || result === FAILURE) {
                    status = result;
                } else {
                    l.warn('tick() of AsyncAction should return SUCCESS or FAILURE only');
                    status = ERROR;
                }

                if (result !== SUCCESS) {
                    l.warn(`AsyncAction ${this.type} ${this.name} has resolved with result ` + result);
                } else {
                    l.i(`AsyncAction ${this.type} ${this.name} has resolved with result ` + result);
                }
                bb.set('status', status, tick.tree.id, this.id);
            })
            .catch((err) => {
                let status = bb.get('status', tick.tree.id, this.id);

                if (status !== RUNNING) {
                    l.warn('run() resolved after timeout, the result gonna ignored');
                    return;
                }
                status = FAILURE;
                l.err(`Error on run() of ${this.type} ${this.name}`, {
                    err: err,
                    message: _.get(err, 'message')
                });

                bb.set('status', status, tick.tree.id, this.id);
            });
        return bb.get('status', tick.tree.id, this.id);
    }

    close(tick) {
        tick.blackboard.set('isCalled', false, tick.tree.id, this.id);
    }
};
