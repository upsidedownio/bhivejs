const BaseNode = require('../core/BaseNode');
const {COMPOSITE} = require('../constants');

/**
 * Class BaseComposite
 * @extends BaseNode
 */
class BaseComposite extends BaseNode {

    /**
     * @constructor
     * @param {object}      params
     * @param {BaseNode[]}  params.children
     * @param {string}      params.type            - Node type (class name)
     * @param {string}      params.name
     * @param {string}     [params.description]
     * @param {object}     [params.properties]
     */
    constructor({children = [], type = 'Composite', name, description, properties} = {}) {
        super({
            category: COMPOSITE,
            type,
            name,
            description,
            properties,
        });
        this.children = (children).slice(0);
    }
}

module.exports = BaseComposite;
