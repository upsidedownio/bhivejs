const Logger = require('../utils/Logger');

/** @module Context */

/**
 * @typedef {object} RunLog
 * @property {object} context
 * @property {NodeData} returnNode
 */

/**
 * Class Context
 */
class Context {
    /**
     * @constructor
     * @param {BehaviorTree}            tree
     * @param {Blackboard}              blackboard
     * @param {BehaviorTreeOptions}    [options]
     */
    constructor(tree, blackboard, options = {}) {
        /** @type {BehaviorTree}
         * @deprecated
         * @description use behaviorTree instead
         * */
        this.tree = tree;
        this.behaviorTree = tree;
        /**
         * @type {Blackboard}
         * @private
         */
        this._blackboard = blackboard;
        /** @type {BehaviorTreeOptions} */
        this.options = options;
        /** @type {BaseNode[]} */
        this.activeNodes = [];
        /** @type {Logger} */
        this.logger = new Logger(this, this.options.logger);
    }

    /**
     * @type {Blackboard}
     */
    get blackboard() {
        return this._blackboard;
    }

    set blackboard(blackboard) {
        this._blackboard = blackboard;
    }

    /**
     * @type {TreeBoard}
     */
    get treeBoard() {
        return this._blackboard.tree(this.behaviorTree);
    }

    /**
     * @param {BaseNode} node   - caller node
     **/
    enterNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `ENTER \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @param {BaseNode} node   - caller node
     **/
    openNode(node) {
        this.treeBoard.createNode(node);
        this.treeBoard.node(node).openNode();
        this.activeNodes.push(node);
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `OPEN \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @param {BaseNode} node   - caller node
     **/
    runNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `RUN \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @param {BaseNode} node   - caller node
     **/
    closeNode(node) {
        this.treeBoard.node(node).closeNode();
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `CLOSE \t${node.name} - ${node.type} - ${node.id}`);
        this.activeNodes.pop();
    }

    /**
     * @param {BaseNode} node   - caller node
     **/
    exitNode(node) {
        this.logger.DEBUG_debug('  '.repeat(this.activeNodes.length) + `EXIT \t${node.name} - ${node.type} - ${node.id}`);
    }
}

module.exports = Context;
