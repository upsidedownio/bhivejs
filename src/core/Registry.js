/**@typedef {string} NodeType*/
/**@typedef {class} NodeDefinition*/
/**@typedef {Object.<NodeType, NodeDefinition>} Registers*/

/**
 * Class Registry
 */
class Registry {

    /**
     * @constructor
     * @param {Registers} registers
     */
    constructor(registers) {
        /** @type {Registers} */
        this.registers = registers || {};
    }

    /**
     * @param {Registers} registers
     */
    merge(registers) {
        this.registers = Object.assign(this.registers, registers)
    }

    /**
     * @param {NodeType}                type
     * @param {NodeDefinition|string}   node
     */
    register(type, node) {
        if (typeof node === 'string') {
            this.register[type] = require(node)
        } else {
            this.register[type] = node;
        }
    }

    /**
     * @param {NodeType} nodeType
     * @returns {NodeDefinition}
     */
    getNode(nodeType) {
        return this.registers[nodeType];
    }

    /**
     * @returns {NodeType[]}
     */
    getNodeTypes() {
        return Object.keys(this.registers);
    }
}

module.exports = Registry;
