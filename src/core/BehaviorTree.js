const _ = require('lodash');
const uuid = require('uuid/v4');
const Tick = require('./Tick');

/**
 * @class BehaviorTree
 **/
module.exports = class BehaviorTree {

    /**
     * @constructor
     **/
    constructor() {
        this.id = uuid();
        this.name = 'The behavior tree';
        this.description = 'Default description';
        this.properties = {};
        this.root = null;
        this.debug = null;
    }

    /**
     * @param {Blackboard}  blackboard  - An instance of blackboard object.
     * @param {Object}      target      - A target object.
     * @return {Constant} The tick signal state.
     **/
    tick(blackboard, target) {
        /* CREATE A TICK OBJECT */
        const tick = new Tick();
        tick.debug = this.debug;
        tick.target = target;
        tick.blackboard = blackboard;
        tick.tree = this;

        /* TICK NODE */
        const state = this.root._execute(tick);

        blackboard.tree(this.id).set('activeNodes', tick.activeNodes);

        return state;
    }
};
