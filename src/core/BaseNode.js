const uuid = require('uuid/v4');
const {RUNNING, ERROR} = require('../constants');

/**
 * @typedef {string} NodeId
 */

/**
 * @typedef {'TASK'|'COMPOSITE'|'CONDITION'|'DECORATOR'} NodeCategory
 */

/**
 * @typedef {object} NodeData
 * @property {string} id            - uuid of class
 * @property {string} type          - type of node (e.g. class name)
 * @property {string} name          - name of node
 * @property {NodeCategory} category - categories of nodes
 * @property {string} description
 */

/**
 * Class BaseNode
 * @category Core
 **/

class BaseNode {
    /**
     * @constructor
     * @param {object}          params
     * @param {NodeCategory}    params.category
     * @param {string}          params.type
     * @param {string}          params.name
     * @param {string}          params.description
     * @param {object}          params.properties
     **/
    constructor({category, type, name, description, properties} = {}) {

        /**
         * unique identifier of node. It uses the UUID format.
         * @type {NodeId}
         * @see RFC4122: https://tools.ietf.org/html/rfc4122
         **/
        this.id = uuid();

        /**
         * Node category. Must be `COMPOSITE`, `DECORATOR`, `TASK` or
         * `CONDITION`. This is defined automatically be inheriting the
         * correspondent class.
         * @type {NodeCategory}
         **/
        this.category = category || '';

        /**
         * type of node. Must be a unique. e.g. class name
         * @type {string}
         **/
        this.type = type || this.constructor.name;

        /**
         * Node name.
         * @type {string}
         **/
        this.name = name || this.type;

        /**
         * Node description.
         * @type {string}
         */
        this.description = description || '';

        /**
         * A dictionary (key, value) describing the node properties. Useful for
         * defining custom variables inside the visual editor.
         *
         * @type {Object}
         * @readonly
         **/
        this.properties = properties || {};
    }

    /**
     * @param {Context} context A run instance.
     * @returns {Constant} The run state.
     */
    tick(context) {
        return this._tick(context);
    }

    /**
     * @param {Context} context A run instance.
     * @returns {Constant} The run state.
     **/
    _tick(context) {
        // ENTER
        this._enter(context);

        // OPEN
        if (!context.blackboard.tree(context.tree).node(this).get('isOpen')) {
            this._open(context);
        }

        // RUN
        const status = this._run(context);
        context.blackboard.tree(context.tree).node(this).set('lastStatus', status);

        // CLOSE
        if (status !== RUNNING) {
            this._close(context);
        }

        // EXIT
        this._exit(context);

        return status;
    }

    /**
     * Wrapper for enter method.
     * @param {Context} context   - A run instance.
     * @protected
     **/
    _enter(context) {
        context.enterNode(this);
        this.enter(context);
    }

    /**
     * Wrapper for open method.
     * @param {Context} context     - A run instance.
     * @protected
     **/
    _open(context) {
        context.openNode(this);
        context.blackboard.tree(context.tree).node(this).set('isOpen', true);
        this.open(context);
    }

    /**
     * Wrapper for run method.
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     * @protected
     **/
    _run(context) {
        try {
            context.runNode(this);
            const result = this.run(context);
            context.logger.DEBUG_debug(`run() result:\t${this.name}: ` + result);
            return result;
        } catch (e) {
            context.logger.DEBUG_err(
                `failed to execute run() on node [${this.type}] ${this.name}(${this.id})\n`
                + `${e.message}\n${e.stack}`);
            return ERROR;
        }
    }

    /**
     * Wrapper for close method.
     * @param {Context} context A run instance.
     * @returns {void}
     **/
    _close(context) {
        context.closeNode(this);
        context.blackboard.tree(context.tree.id).node(this.id).set('isOpen', false);
        this.close(context);
    }

    /**
     * Wrapper for exit method.
     * @param {Context} context A run instance.
     * @protected
     **/
    _exit(context) {
        context.exitNode(this);
        this.exit(context);
    }

    /**
     * Enter method, override this to use. It is called every time a node is
     * asked to run, before the run itself.
     *
     * @param {Context} context A run instance.
     **/
    enter(context) {
    }

    /**
     * Open method, override this to use. It is called only before the run
     * callback and only if the not isn't closed.
     *
     * Note: a node will be closed if it returned `RUNNING` in the run.
     *
     * @param {Context} context A run instance.
     **/
    open(context) {
    }

    /**
     * Context method, override this to use. This method must contain the real
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to run.
     *
     * @param {Context} context A run instance.
     **/
    run(context) {
    }

    /**
     * Close method, override this to use. This method is called after the run
     * callback, and only if the run return a state different from
     * `RUNNING`.
     *
     * @param {Context} context A run instance.
     **/
    close(context) {
    }

    /**
     * Exit method, override this to use. Called every time in the end of the
     * execution.
     *
     * @param {Context} context A run instance.
     **/
    exit(context) {
    }
}

module.exports = BaseNode;
