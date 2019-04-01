const _ = require('lodash');
const uuid = require('uuid/v4');
const Context = require('./Context');
const Blackboard = require('./Blackboard');

/**
 * @class BehaviorTree
 **/
class BehaviorTree {

    /**
     * @constructor
     * @param {BaseNode}  rootNode
     * @param {Object}     [opts]
     * @param {Logger}     [opts.logger]
     * @param {Object}     [opts.properties]
     **/
    constructor(rootNode, {logger, properties} = {}) {
        /**
         * @type {string}
         * @member
         */
        this.id = uuid();
        /**
         * @type {Object}
         * @member
         */
        this.name = 'The behavior tree';
        /**
         * @type {Object}
         * @member
         */
        this.description = 'Default description';
        /**
         * @type {Object}
         * @member
         */
        this.properties = properties || {};
        /**
         * @type {BaseNode}
         * @member
         */
        this.root = rootNode;
        /**
         * @type {Boolean}
         * @member
         */
        this.debug = null;
    }

    /**
     * @param {Blackboard}  blackboard  - An instance of blackboard object.
     * @param {Object}      target      - A target object.
     * @return {Constant} The run signal state.
     **/
    tick(blackboard, target) {
        const context = new Context(this);
        context.debug = this.debug;
        context.target = target;
        context.blackboard = blackboard;
        context.tree = this;

        /* TICK NODE */
        const state = this.root.tick(context);

        blackboard.tree(this.id).set('activeNodes', context.activeNodes);

        return state;
    }
}

module.exports = BehaviorTree;
