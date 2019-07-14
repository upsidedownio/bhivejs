/**
 * @typedef {object} TreeDefinition
 * @property {string}                   type
 * @property {string}                  [name]
 * @property {object}                  [properties]
 * @property {Array<TreeDefinition>}   [children]
 * @property {TreeDefinition}          [child]
 */

/**
 * @class TreeBuilder
 */
class TreeBuilder {

    /**
     * @param {object}          param
     * @param {Registry}        param.registry
     * @param {TreeDefinition}  param.treeDefinition
     */
    constructor({registry, treeDefinition} = {}) {
        this.registry = registry;
        this.treeDefinition = treeDefinition;
    }
}

module.exports = TreeBuilder;
