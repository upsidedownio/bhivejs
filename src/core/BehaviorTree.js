const _ = require('lodash');
const uuid = require('uuid/v4');
const Context = require('./Context');
const Blackboard = require('./Blackboard');
const {defaultBehaviorTreeOptions} = require('../constants');

/** @module BehaviorTree */

/**
 * Class BehaviorTree
 */
class BehaviorTree {

    /**
     * @constructor
     * @param {BaseNode}               [root]
     * @param {Blackboard}             [blackboard]
     * @param {Object}                 [properties]
     * @param {BehaviorTreeOptions}    [options]
     **/
    constructor({root, blackboard, properties, options} = {options: {}}) {
        /**
         * unique id of node
         * @type {string}
         */
        this.id = uuid();
        /**
         * @type {string}
         */
        this.name = 'BehaviorTree';
        /**
         * @type {string}
         */
        this.description = `BehaviorTree with id: ${this.id}`;
        /**
         * @type {Object}
         */
        this.properties = properties || {};
        /**
         * @type {BaseNode}
         * @private
         */
        this._root = root;
        /**
         * @type {BehaviorTreeOptions}
         */
        this.options = _.defaults(options, defaultBehaviorTreeOptions);
        /**
         * @type {Boolean}
         */
        this.debug = this.options.debug || false;
        /**
         * @type {Blackboard}
         * @private
         */
        this._blackboard = blackboard || new Blackboard();
        this._blackboard.createTree(this);
        /**
         * @type {Context}
         */
        this.context = new Context(this, this._blackboard, this.options);
    }

    /**
     * @type {BaseNode}
     */
    get root() {
        return this._root;
    }

    set root(root) {
        this._root = root;
    }

    /**
     * @type {Blackboard}
     */
    get blackboard() {
        return this._blackboard;
    }

    set blackboard(blackboard) {
        this._blackboard = blackboard;
        this.context.blackboard = blackboard;
    }

    /**
     * @param {Context}    [context]
     * @return {NodeStatus}
     **/
    tick(context) {

        if (!context) {
            context = this.context;
        }
        context.behaviorTree = this;

        const state = this.root.tick(context);
        context.blackboard.tree(this.id).set('activeNodes', context.activeNodes);

        return state;
    }
}

module.exports = BehaviorTree;
