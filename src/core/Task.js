const BaseNode = require('../core/BaseNode');
const {TASK} = require('../constants');

class Task extends BaseNode {

    /**
     * Creates an instance of Task.
     * @param {Object} [options]
     * @param {String} [options.type='Action'] Node type.
     * @param {String} [options.name]
     * @param {Object} [options.properties]
     * @memberOf Task
     */
    constructor({type = 'Task', name, run, properties} = {}) {
        super({
            category: TASK,
            type: type,
            name,
            properties
        });
        this.run = run;
    }

}

module.exports = Task;
