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
     * @param {BehaviorTree}    tree
     * @param {Blackboard}      blackboard
     * @param {object}         [opts]
     * @param {boolean}        [opts.debug]
     * @param {SYSLOG_LEVEL}   [opts.debug_level='emerg']
     * @param {function}       [opts.logger]
     * @param {SYSLOG_LEVEL}   [opts.log_level='warning']
     */
    constructor(tree, blackboard, {debug = false, debug_level = 'emerg', log_level = 'warning', logger} = {
        debug: false,
        debug_level: 'emerg',
        log_level: 'warning',
        logger: null
    }) {
        this.tree = tree;
        this.debug = debug;
        this.debug_level = debug_level;
        this.log_level = log_level;
        this.target = null;
        /**
         * @type {Blackboard}
         * @memberOf Context
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
     * @function runNode
     * @param {BaseNode} node The node that called this method.
     **/
    runNode(node) {
        this.logger.debug('  '.repeat(this.activeNodes.length) + `RUN \t${node.name} - ${node.type} - ${node.id}`);
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
}

module.exports = Context;
