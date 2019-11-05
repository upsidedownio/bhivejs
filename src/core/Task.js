const BaseNode = require('../core/BaseNode');
const {TASK} = require('../constants');

/**
 * Class Task
 * @extends BaseNode
 */
class Task extends BaseNode {
    /**
     * Creates an instance of Task.
     * @param {Object} [params]
     * @param {String} [params.type='Action'] Node type.
     * @param {String} [params.name]
     * @param {Object} [params.properties]
     */
    constructor({type = 'Task', name, run, description ,properties} = {}) {
        super({
            category: TASK,
            type: type,
            name,
            description,
            properties
        });
        /** @type {function(Context)} */
        this.run = run;
    }

}

module.exports = Task;
