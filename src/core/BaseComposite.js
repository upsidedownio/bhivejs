const BaseNode = require('../core/BaseNode');
const {COMPOSITE} = require('../constants');

/**
 * @class BaseComposite
 * @extends BaseNode
 **/

module.exports = class BaseComposite extends BaseNode {

    /**
     * @param {Object}      options
     * @param {BaseNode[]}  options.children
     * @param {String}      options.type        Node type
     * @param {String}      options.name
     * @param {Object}      options.properties
     * @memberOf BaseComposite
     */
    constructor({children = [], type = 'Composite', name, properties} = {}) {
        super({
            category: COMPOSITE,
            type,
            name,
            properties,
        });
        this.children = (children).slice(0);
    }

};
