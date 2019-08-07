const _ = require('lodash');

/**
 * Class Board
 */
class Board {
    constructor() {
        /** @type {*} */
        this.board = {};
    }

    /**
     * @param {string}  key
     * @returns {*}
     */
    get(key) {
        return _.get(this.board, key)
    }

    /**
     * @param {string}  key
     * @param {*}       value
     */
    set(key, value) {
        _.set(this.board, key, value)
    }

    /**
     * @param {string} key
     */
    clear(key) {
        delete this.board[key];
    }

    /**
     * check board is empty or not
     * @returns {boolean}
     */
    isEmpty() {
        return _.isEmpty(this.board);
    }

    /**
     * @returns {object}
     */
    toJSON() {
        return this.board;
    }
}

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

/**
 * Class Blackboard
 **/
class Blackboard {

    /**
     * Initialization method.
     * @constructor
     **/
    constructor() {
        /**
         * @type {Board}
         */
        this._shared = new Board();
        /**
         * @type {Object.<string, TreeBoard>}
         */
        this._trees = {};
    }

    /**
     * Get tree board by treeId
     * @param {BaseNode|string} tree             - tree id
     * @param {object}          opts               - options
     * @param {boolean}        [opts.safe=true]    - if flag enabled, generate empty tree board when cannot find tree board
     * @returns {Board}
     */
    tree(tree, {safe = true} = {safe: true}) {
        const treeId = tree.id || tree;
        const treeBoard = _.get(this._trees, treeId);
        if (!treeBoard && safe) {
            _.set(this._trees, treeId, new TreeBoard());
        }
        return _.get(this._trees, treeId);
    }

    /**
     * @type {Object.<string, TreeBoard>}
     */
    get trees() {
        return this._trees;
    }

    /**
     * @param {BaseNode|string}  tree
     * @param {BaseNode|string}  node
     * @returns {TreeBoard}
     */
    node(tree, node) {
        return this.tree(tree).node(node);
    }

    /**
     * @returns {object}
     */
    toJSON() {
        return {
            trees: _.reduce(this._trees, (result, value, key) => {
                _.set(result, key, value.toJSON());
                return result;
            }, {}),
            shared: this._shared.toJSON()
        }
    }

    /**
     * @param {String}  key     - key where store value
     * @param {*}       value   - value to store
     * @param {String} [treeId] - Tree id
     * @param {String} [nodeId] - Node id
     **/
    set(key, value, treeId, nodeId) {
        let targetBoard = this._shared;
        // TODO remove 3rd, 4th argument from this function
        if (nodeId) {
            console.error('Blackboard.set(key, value, treeId, nodeId) is deprecated.' +
                ' use Blackboard.tree(treeId).node(nodeId).set(key, value) instead\n' + new Error().stack);
            targetBoard = this.tree(treeId).node(nodeId);
            process.exit(1);
        } else if (treeId) {
            console.error('Blackboard.set(key, value, treeId) is deprecated.' +
                ' use Blackboard.tree(treeId).set(key, value) instead\n' + new Error().stack);
            targetBoard = this.tree(treeId);
            process.exit(1);
        }

        return targetBoard.set(key, value);
    }

    /**
     * @param {String} key          - key
     * @param {String} [treeId]     - Tree id
     * @param {String} [nodeId]     - Node id
     * @return {*}
     **/
    get(key, treeId, nodeId) {
        let targetBoard = this._shared;
        // TODO remove 3rd, 4th argument from this function
        if (nodeId) {
            console.error('Blackboard.get(key, treeId, nodeId) is deprecated.' +
                ' use Blackboard.tree(treeId).node(nodeId).get(key) instead\n' + new Error().stack);
            targetBoard = this.tree(treeId).node(nodeId);
            process.exit(1);
        } else if (treeId) {
            console.error('Blackboard.get(key, treeId) is deprecated.' +
                ' use Blackboard.tree(treeId).get(key) instead\n' + new Error().stack);
            targetBoard = this.tree(treeId);
            process.exit(1);
        }

        return targetBoard.get(key);
    }
}

module.exports = Blackboard;
