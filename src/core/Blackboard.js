const _ = require('lodash');
const Board = require('./Board');
const TreeBoard = require('./TreeBoard');

/**
 * @module BlackBoard
 */

/**
 * Class Blackboard
 */
class Blackboard {

    /**
     * Initialization method.
     * @constructor
     **/
    constructor() {
        /** @type {Board} */
        this._shared = new Board();
        /** @type {Object.<NodeId, TreeBoard>} */
        this._trees = {};
    }

    /**
     * Get tree board by treeId
     * @param {BaseNode|string} tree               - tree id
     * @param {object}         [opts]              - options
     * @param {boolean}        [opts.safe=false]   - if flag enabled, generate empty tree board when cannot find tree board
     * @returns {TreeBoard}
     */
    tree(tree, opts = {safe: false}) {
        const treeId = _.get(tree, 'id') || tree;
        const treeBoard = _.get(this._trees, treeId);
        if (!treeBoard && opts.safe) {
            _.set(this._trees, treeId, new TreeBoard());
        }
        return _.get(this._trees, treeId);
    }

    /**
     * Create new TreeBoard
     * @param {BehaviorTree|NodeId} tree
     * @returns {undefined|TreeBoard}
     */
    createTree(tree) {
        if (!tree) {
            return undefined;
        }
        const treeId = tree.id || tree;
        const existNodeBoard = this.tree(treeId);
        if (existNodeBoard) {
            return existNodeBoard;
        }
        _.set(this._trees, treeId, new TreeBoard());
        return this._trees[treeId];
    }

    /**
     * Remove specific TreeBoard
     * @param {BehaviorTree|NodeId} tree
     * @returns {boolean}
     */
    removeTree(tree) {
        if (!tree) {
            return false;
        }
        delete this._trees[tree.id || tree];
        return true;
    }

    /**
     * Get list of BehaviorTree Id
     * @returns {NodeId[]}
     */
    listTree() {
        return Object.keys(this._trees);
    }

    /**
     * get shared board
     * @returns {Board}
     */
    get shared() {
        return this._shared;
    }

    /**
     * Get all TreeBoard
     * @type {Object.<string, TreeBoard>}
     */
    get trees() {
        return this._trees;
    }

    /**
     * Dump blackboard data in JSON
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
     * Set data with key
     * @param {String}  key     - key where store value
     * @param {*}       value   - value to store
     **/
    set(key, value) {
        return this._shared.set(key, value);
    }

    /**
     * Get data by using key
     * @param {String} key          - key
     * @return {*}
     **/
    get(key) {
        return this._shared.get(key);
    }
}

module.exports = Blackboard;
