const BaseNode = require('../core/BaseNode');
const {TASK} = require('../constants');

module.exports = class Task extends BaseNode {

    /**
     * Creates an instance of Action.
     * @param {Object} [options]
     * @param {String} [options.type='Action'] Node type.
     * @param {String} [options.name]
     * @param {Object} [options.properties]
     * @memberOf Task
     */
    constructor({type = 'Task', name, tick, properties} = {}) {
        super({
            category: TASK,
            type: type,
            name,
            properties
        });
        this.tick = tick;
    }

};
