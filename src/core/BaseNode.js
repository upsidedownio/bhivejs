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
     * @method execute
     * @memberOf BaseNode
     * @param {Tick} tick A tick instance.
     * @return {Constant} The tick state.
     */
    execute(tick) {
        return this.execute(tick);
    }

    /**
     * @method _execute
     * @memberOf BaseNode
     * @param {Tick} tick A tick instance.
     * @return {Constant} The tick state.
     * @private
     **/
    _execute(tick) {
        // ENTER
        this._enter(tick);

        // OPEN
        if (!tick.blackboard.get('isOpen', tick.tree.id, this.id)) {
            this._open(tick);
        }

        // TICK
        const status = this._tick(tick);
        tick.blackboard.set('lastStatus', status, tick.tree.id, this.id);

        // CLOSE
        if (status !== RUNNING) {
            this._close(tick);
        }

        // EXIT
        this._exit(tick);

        return status;
    }

    /**
     * Wrapper for enter method.
     * @method _enter
     * @memberOf BaseNode
     * @param {Tick} tick   - A tick instance.
     * @private
     **/
    _enter(tick) {
        tick.enterNode(this);
        this.enter(tick);
    }

    /**
     * Wrapper for open method.
     * @method _open
     * @memberOf BaseNode
     * @param {Tick} tick A tick instance.
     * @private
     **/
    _open(tick) {
        tick.openNode(this);
        tick.blackboard.set('isOpen', true, tick.tree.id, this.id);
        tick.blackboard.set('status', RUNNING, tick.tree.id, this.id);
        this.open(tick);
    }

    /**
     * Wrapper for tick method.
     * @method _tick
     * @memberOf BaseNode
     * @param {Tick} tick A tick instance.
     * @return {Constant} A state constant.
     * @private
     **/
    _tick(tick) {
        try {
            tick.tickNode(this);
            const result = this.tick(tick);
            if (tick.debug) {
                console.log(`tick result:\t${this.name}: ` + result);
            }
            return result;
        } catch (e) {
            console.error(`failed to execute tick on node [${this.type}] ${this.name}(${this.id})`);
            return ERROR;
        }
    }

    /**
     * Wrapper for close method.
     * @method _close
     * @param {Tick} tick A tick instance.
     * @private
     **/
    _close(tick) {
        tick.closeNode(this);
        tick.blackboard.set('isOpen', false, tick.tree.id, this.id);
        this.close(tick);
    }

    /**
     * Wrapper for exit method.
     * @method _exit
     * @param {Tick} tick A tick instance.
     * @private
     **/
    _exit(tick) {
        tick.exitNode(this);
        this.exit(tick);
    }

    /**
     * Enter method, override this to use. It is called every time a node is
     * asked to execute, before the tick itself.
     *
     * @method enter
     * @param {Tick} tick A tick instance.
     **/
    enter(tick) {
    }

    /**
     * Open method, override this to use. It is called only before the tick
     * callback and only if the not isn't closed.
     *
     * Note: a node will be closed if it returned `RUNNING` in the tick.
     *
     * @method open
     * @param {Tick} tick A tick instance.
     **/
    open(tick) {
    }

    /**
     * Tick method, override this to use. This method must contain the real
     * execution of node (perform a task, call children, etc.). It is called
     * every time a node is asked to execute.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @memberOf BaseNode
     **/
    tick(tick) {
    }

    /**
     * Close method, override this to use. This method is called after the tick
     * callback, and only if the tick return a state different from
     * `RUNNING`.
     *
     * @method close
     * @param {Tick} tick A tick instance.
     **/
    close(tick) {
    }

    /**
     * Exit method, override this to use. Called every time in the end of the
     * execution.
     *
     * @method exit
     * @param {Tick} tick A tick instance.
     **/
    exit(tick) {
    }
};
