const BaseNode = require('../core/BaseNode');
const {TASK} = require('../constants');

/**
 * Class Task
 * @extends BaseNode
 */
class Task extends BaseNode {
    /**
     * Creates an instance of Task.
     * @param {Object} [options]
     * @param {String} [options.type='Action'] Node type.
     * @param {String} [options.name]
     * @param {Object} [options.properties]
     */
    constructor({type = 'Task', name, run, description ,properties} = {}) {
        super({
            category: TASK,
            type: type,
            name,
            description,
            properties
        });
        /** @type {function} */
        this.run = run;
    }

}

module.exports = Task;
