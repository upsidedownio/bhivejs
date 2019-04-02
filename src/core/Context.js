const Logger = require('../utils/Logger');

/**
 * @typedef {object} RunLog
 * @property {object} context
 * @property {NodeData} returnNode
 */

/**
 * @class Context
 **/
class Context {
    /**
     * @constructor
     * @param {BehaviorTree}        tree
     * @param {Blackboard}          blackboard
     * @param {BehaviorTreeOptions}[options]
     */
    constructor(tree, blackboard, options = {}) {
        /**
         * @type {BehaviorTree}
         * @member Context
         */
        this.tree = tree;
        /**
         * @type {Blackboard}
         * @member Context
         */
        this._blackboard = blackboard;
        /**
         * @type {BehaviorTreeOptions}
         * @member Context
         */
        this.options = options;
        /**
         * @type {BaseNode[]}
         * @member Context
         */
        this.activeNodes = [];
        /**
         * @type {Logger}
         * @member Context
         */
        this.logger = new Logger(this, this.options.logger);
    }

    get blackboard() {
        return this._blackboard;
    }

    set blackboard(bb) {
        this._blackboard = bb;
    }

    /**
     * @function enterNode
     * @memberOf Context
     * @param {BaseNode} node   - caller node
     **/
    enterNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `ENTER \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function openNode
     * @memberOf Context
     * @param {BaseNode} node   - caller node
     **/
    openNode(node) {
        this.activeNodes.length++;
        this.activeNodes.push(node);
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `OPEN \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function runNode
     * @memberOf Context
     * @param {BaseNode} node   - caller node
     **/
    runNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `RUN \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function closeNode
     * @memberOf Context
     * @param {BaseNode} node   - caller node
     **/
    closeNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `CLOSE \t${node.name} - ${node.type} - ${node.id}`);
        this.activeNodes.pop();
    }

    /**
     * @function exitNode
     * @memberOf Context
     * @param {BaseNode} node   - caller node
     **/
    exitNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `EXIT \t${node.name} - ${node.type} - ${node.id}`);
    }
}

module.exports = Context;
