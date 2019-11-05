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
     * @param {object}      params
     * @param {BaseNode}    params.child                - The node that affected under the decorator
     * @param {string}     [params.type]                - Node type. Default to `Decorator`
     * @param {string}     [params.name='Decorator']
     * @param {string}     [params.description]
     * @param {object}     [params.properties]
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
