const BaseNode = require('./BaseNode');
const {DECORATOR} = require('../constants');

/**
 * Class BaseDecorator
 * @extends BaseNode
 */
class BaseDecorator extends BaseNode {
     /**
     * Creates an instance of Decorator.
     * @constructor
     * @param {Object} opts
     * @param {String} opts.type Node type. Default to `Decorator`.
     * @param {String} opts.name
     * @param {Object} opts.properties
     */
    constructor({child = null, type = 'Decorator', name, description, properties} = {}) {
        super({
            category: DECORATOR,
            type,
            name,
            description,
            properties,
        });
        /** @type {BaseNode} */
        this.child = child;
    }

}

module.exports = BaseDecorator;
