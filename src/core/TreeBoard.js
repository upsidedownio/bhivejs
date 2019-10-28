const _ = require('lodash');
const Board = require('./Board');
const NodeBoard = require('./NodeBoard');

/**
 * Class TreeBoard
 * @extends Board
 */
class TreeBoard extends Board {
    constructor() {
        super();
        /**
         * @type {Object.<string, Board>}
         * @private
         */
        this._nodes = {};
    }

    /**
     * @param {BaseNode|string} node
     * @param {object} opts
     * @param {boolean} [opts.safe=false] if this flag enabled, generate empty node board when cannot find node board
     * @returns {Board}
     */
    node(node, {safe = true} = {safe: false}) {
        if (!node) {
            return undefined;
        }
        const nodeId = node.id || node;
        const nodeBoard = _.get(this._nodes, nodeId);
        if (!nodeBoard && safe) {
            _.set(this._nodes, nodeId, new NodeBoard());
        }
        return _.get(this._nodes, nodeId);
    }

    /**
     * get all NodeBoards
     * @returns {object.<string, Board>}
     */
    get nodes() {
        return this._nodes;
    }

    isEmpty() {
        if (!super.isEmpty()) {
            return false;
        }
        for (let node of this._nodes) {
            if (!node.isEmpty()) {
                return false;
            }
        }
        return true;
    }

    /**
     * @returns {UUID[]}
     */
    listNode(){
        return Object.keys(this._nodes);
    }

    /**
     * create board for node
     * @param {BaseNode|UUID} node
     * @returns {Board|undefined} return created board, if failed, is returns undefined
     */
    createNode(node) {
        if (!node) {
            return undefined;
        }
        const nodeId = node.id || node;
        const existNodeBoard = this.node(nodeId);
        if (existNodeBoard) {
            return existNodeBoard;
        }
        _.set(this._nodes, nodeId, new NodeBoard());
        return this._nodes[nodeId];
    }

    /**
     * @param {BaseNode|UUID} node
     * @returns {boolean} deletion success or not
     */
    removeNode(node) {
        if (!node) {
            return false;
        }
        delete this._nodes[node.id || node];
        return true;
    }

    gc() {
        for (let [node, nodeId] of this._nodes) {
            if (node.isEmpty()) {
                this.removeNode(nodeId);
            }
        }
    }

    /**
     * @param {object} [opts]
     * @param {boolean} [opts.tree=true]
     * @param {boolean} [opts.node=true]
     * @returns {object}
     */
    toJSON({tree = true, node = true} = {tree: true, node: true}) {
        const json = {};
        if (tree) {
            json.tree = this.board;
            json.treeMemory = this.board;
        }
        if (node) {
            json.node = this._nodes;
        }

        return json;
    }
}

module.exports = TreeBoard;
