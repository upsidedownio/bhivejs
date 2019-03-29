const Logger = require('../utils/Logger');
/**
 * @typedef {object} TickLog
 * @property {object} context
 * @property {NodeData} returnNode
 */

/**
 * @class Tick
 **/
module.exports = class Tick {
    /**
     * Initialization method.
     * @constructor
     **/
    constructor({debug = false, blackboard = null, logger} = {}) {
        this.tree = null;
        this.debug = debug;
        this.debug_log = 'warn';
        this.target = null;
        /**
         * @type {Blackboard}
         * @memberOf Tick
         */
        this.blackboard = blackboard;
        this.activeNodes = [];
        /**
         * @type {Logger}
         */
        this.logger = new Logger(this, logger);
    }

    /**
     * Called when entering a node (called by BaseNode).
     * @function enterNode
     * @param {BaseNode} node The node that called this method.
     **/
    enterNode(node) {
        this.logger.debug('  '.repeat(this.activeNodes.length) + `ENTER \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function openNode
     * @param {BaseNode} node The node that called this method.
     **/
    openNode(node) {
        this.activeNodes.length++;
        this.activeNodes.push(node);
        this.logger.debug('  '.repeat(this.activeNodes.length) + `OPEN \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function tickNode
     * @param {BaseNode} node The node that called this method.
     **/
    tickNode(node) {
        this.logger.debug('  '.repeat(this.activeNodes.length) + `TICK \t${node.name} - ${node.type} - ${node.id}`);
    }

    /**
     * @function closeNode
     * @param {BaseNode} node The node that called this method.
     **/
    closeNode(node) {
        this.logger.debug('  '.repeat(this.activeNodes.length) + `CLOSE \t${node.name} - ${node.type} - ${node.id}`);
        this.activeNodes.pop();
    }

    /**
     * @function exitNode
     * @param {BaseNode} node The node that called this method.
     **/
    exitNode(node) {
        this.logger.debug('  '.repeat(this.activeNodes.length) + `EXIT \t${node.name} - ${node.type} - ${node.id}`);
    }
};
