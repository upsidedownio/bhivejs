const _ = require('lodash');
const uuid = require('uuid/v4');
const Context = require('./Context');
const Blackboard = require('./Blackboard');
const {defaultBehaviorTreeOptions} = require('../constants');

/**
 * Class BehaviorTree
 **/
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
         */
        this._blackboard = blackboard || new Blackboard();
        /**
         * @type {Context}
         */
        this.context = new Context(this, this._blackboard, this.options);
    }

    /**
     * @returns {BaseNode}
     */
    get root() {
        return this._root;
    }

    /**
     * @param {BaseNode} root
     */
    set root(root) {
        this._root = root;
    }

    /**
     * @returns {Blackboard}
     */
    get blackboard() {
        return this._blackboard;
    }

    /**
     * @param {Blackboard} blackboard
     */
    set blackboard(blackboard) {
        this._blackboard = blackboard;
        this.context._blackboard = blackboard;
    }

    /**
     * @param {Context}    [context]
     * @return {Constant}
     **/
    tick(context) {

        if (!context) {
            context = this.context;
        }
        context.tree = this;

        const state = this.root.tick(context);
        context.blackboard.tree(this.id).set('activeNodes', context.activeNodes);

        return state;
    }
}

module.exports = BehaviorTree;
