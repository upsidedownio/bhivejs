const _ = require('lodash');
const uuid = require('uuid/v4');
const Context = require('./Context');
const Blackboard = require('./Blackboard');
const {defaultBehaviorTreeOptions} = require('../constants');

/**
 * @class BehaviorTree
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
         * @member BehaviorTree
         * @type {string}
         */
        this.id = uuid();
        /**
         * @member BehaviorTree
         * @type {Object}
         */
        this.name = 'BehaviorTree';
        /**
         * @member BehaviorTree
         * @type {Object}
         */
        this.description = `BehaviorTree with id: ${this.id}`;
        /**
         * @member BehaviorTree
         * @type {Object}
         */
        this.properties = properties || {};
        /**
         * @member BehaviorTree
         * @type {BaseNode}
         */
        this._root = root;
        /**
         * @member BehaviorTree
         * @type {BehaviorTreeOptions}
         */
        this.options = _.defaults(options, defaultBehaviorTreeOptions);
        /**
         * @member BehaviorTree
         * @type {Boolean}
         */
        this.debug = this.options.debug || false;
        /**
         * @member BehaviorTree
         * @type {Blackboard}
         */
        this._blackboard = blackboard || new Blackboard();
        /**
         * @member BehaviorTree
         * @type {Context}
         */
        this.context = new Context(this, this._blackboard, this.options);
    }

    get root() {
        return this._root;
    }

    set root(root) {
        this._root = root;
    }

    get blackboard() {
        return this._blackboard;
    }

    set blackboard(bb) {
        this._blackboard = bb;
        this.context._blackboard = bb;
    }

    /**
     * @memberOf BehaviorTree
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
