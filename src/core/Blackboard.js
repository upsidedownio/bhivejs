const _ = require('lodash');
const Board = require('./Board');
const TreeBoard = require('./TreeBoard');

/**
 * Class Blackboard
 **/
class Blackboard {

    /**
     * Initialization method.
     * @constructor
     **/
    constructor() {
        /** @type {Board} */
        this._shared = new Board();
        /** @type {Object.<UUID, TreeBoard>} */
        this._trees = {};
    }

    /**
     * Get tree board by treeId
     * @param {BaseNode|string} tree               - tree id
     * @param {object}         [opts]              - options
     * @param {boolean}        [opts.safe=true]    - if flag enabled, generate empty tree board when cannot find tree board
     * @returns {Board}
     */
    tree(tree, opts = {safe: true}) {
        const treeId = _.get(tree, 'id') || tree;
        const treeBoard = _.get(this._trees, treeId);
        if (!treeBoard && opts.safe) {
            _.set(this._trees, treeId, new TreeBoard());
        }
        return _.get(this._trees, treeId);
    }

    get shared() {
        return this._shared;
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
