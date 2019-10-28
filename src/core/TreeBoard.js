const _ = require('lodash');
const Board = require('./Board');

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
     * @param {boolean} [opts.safe=true] if this flag enabled, generate empty node board when cannot find node board
     * @returns {Board}
     */
    node(node, {safe = true} = {safe: true}) {
        const nodeId = node.id || node;
        const nodeBoard = _.get(this._nodes, nodeId);
        if (!nodeBoard && safe) {
            _.set(this._nodes, nodeId, new Board());
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

    removeNode(node) {
        delete this._nodes[node.id || node];
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
        }
        if (node) {
            json.node = this._nodes;
        }

        return json;
    }
}

module.exports = TreeBoard;
