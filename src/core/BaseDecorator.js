const BaseNode = require('./BaseNode');
const {DECORATOR} = require('../constants');

/**
 * @class BaseDecorator
 * @extends BaseNode
 */
module.exports = class BaseDecorator extends BaseNode {
    /** @member {BaseNode} child

     /**
     * Creates an instance of Decorator.
     * @constructor
     * @param {Object} opts
     * @param {String} opts.type Node type. Default to `Decorator`.
     * @param {String} opts.name
     * @param {Object} opts.properties
     */
    constructor({child = null, type = 'Decorator', name, properties} = {}) {
        super({
            category: DECORATOR,
            type,
            name,
            properties,
        });
        this.child = child;
    }

};
