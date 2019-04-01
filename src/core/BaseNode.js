const uuid = require('uuid/v4');
const {RUNNING, ERROR} = require('../constants');

/**
 * @typedef {'TASK'|'COMPOSITE'|'CONDITION'|'DECORATOR'} NODE_TYPE
 */

/**
 * @typedef {object} NodeData
 * @property {string} id            - uuid of class
 * @property {string} type          - type of node (e.g. class name)
 * @property {string} name          - name of node
 * @property {NODE_TYPE} category
 * @property {string} description
 */

/**
 * @class BaseNode
 **/
module.exports = class BaseNode {

    /**
     * @constructor
     **/
    constructor({category, type, name, description, properties} = {}) {

        this.id = uuid();

        /**
         * Node category. Must be `COMPOSITE`, `DECORATOR`, `ACTION` or
         * `CONDITION`. This is defined automatically be inheriting the
         * correspondent class.
         *
         * @member BaseNode
         **/
        this.category = category || '';

        /**
         * type of node. Must be a unique. e.g. class name
         * @member BaseNode
         **/
        this.type = type || '';

        /**
         * Node name.
         * @optional
         * @member BaseNode
         **/
        this.name = name || this.type;

        /**
         * Node description.
         *
         * @member BaseNode
         */
        this.description = description || '';

        /**
         * A dictionary (key, value) describing the node properties. Useful for
         * defining custom variables inside the visual editor.
         *
         * @property properties
         * @type {Object}
         * @readonly
         **/
        this.properties = properties || {};
    }

    /**
     * @method run
     * @memberOf BaseNode
     * @param {Context} context A run instance.
     * @return {Constant} The run state.
     */
    tick(context) {
        return this._tick(context);
    }

    /**
     * @method _run
     * @memberOf BaseNode
     * @param {Context} context A run instance.
     * @return {Constant} The run state.
     * @private
     **/
    _tick(context) {
        // ENTER
        this._enter(context);

        // OPEN
        if (!context.blackboard.get('isOpen', context.tree.id, this.id)) {
            this._open(context);
        }

        // RUN
        const status = this._run(context);
        context.blackboard.set('lastStatus', status, context.tree.id, this.id);

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
     * @method _enter
     * @memberOf BaseNode
     * @param {Context} context   - A run instance.
     * @private
     **/
    _enter(context) {
        context.enterNode(this);
        this.enter(context);
    }

    /**
     * Wrapper for open method.
     * @method _open
     * @memberOf BaseNode
     * @param {Context} context A run instance.
     * @private
     **/
    _open(context) {
        context.openNode(this);
        context.blackboard.set('isOpen', true, context.tree.id, this.id);
        context.blackboard.set('status', RUNNING, context.tree.id, this.id);
        this.open(context);
    }

    /**
     * Wrapper for run method.
     * @method _run
     * @memberOf BaseNode
     * @param {Context} context A run instance.
     * @return {Constant} A state constant.
     * @private
     **/
    _run(context) {
        try {
            context.runNode(this);
            const result = this.run(context);
            if (context.debug) {
                console.log(`run() result:\t${this.name}: ` + result);
            }
            return result;
        } catch (e) {
            console.error(`failed to execute run() on node [${this.type}] ${this.name}(${this.id})`);
            return ERROR;
        }
    }

    /**
     * Wrapper for close method.
     * @method _close
     * @param {Context} context A run instance.
     * @private
     **/
    _close(context) {
        context.closeNode(this);
        context.blackboard.set('isOpen', false, context.tree.id, this.id);
        this.close(context);
    }

    /**
     * Wrapper for exit method.
     * @method _exit
     * @param {Context} context A run instance.
     * @private
     **/
    _exit(context) {
        context.exitNode(this);
        this.exit(context);
    }

    /**
     * Enter method, override this to use. It is called every time a node is
     * asked to run, before the run itself.
     *
     * @method enter
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
     * @method open
     * @param {Context} context A run instance.
     **/
    open(context) {
    }

    /**
     * Context method, override this to use. This method must contain the real
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to run.
     *
     * @method run
     * @param {Context} context A run instance.
     * @memberOf BaseNode
     **/
    run(context) {
    }

    /**
     * Close method, override this to use. This method is called after the run
     * callback, and only if the run return a state different from
     * `RUNNING`.
     *
     * @method close
     * @param {Context} context A run instance.
     **/
    close(context) {
    }

    /**
     * Exit method, override this to use. Called every time in the end of the
     * execution.
     *
     * @method exit
     * @param {Context} context A run instance.
     **/
    exit(context) {
    }
};
