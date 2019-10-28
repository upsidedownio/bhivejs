const _ = require('lodash');

/**
 * @typedef {string} UUID
 */

/**
 * Class Board
 */
class Board {
    constructor() {
        /** @type {Object.<string, *>} */
        this.board = {};
    }

    /**
     * find data by key
     * @param {string}  key     - key to find data
     * @returns {*} found data
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
     * Delete specific data by key
     * @param {string} key
     */
    unset(key) {
        delete this.board[key];
    }

    /**
     * Clear all data on board
     * @returns {void}
     */
    clear() {
        this.board = {};
    }

    /**
     * Check board is empty or not
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

module.exports = Board;
