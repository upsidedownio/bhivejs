const Board = require('./Board');

/**
 * Class NodeBoard
 */
class NodeBoard extends Board {
    /**
     * @constructor
     * @param {object}  [opt={isOpen: false}]       options
     * @param {boolean} [opt.isOpen=false]          initial value of openFlag
     */
    constructor(opt = {isOpen: false}) {
        super();
        this.set('isOpen', opt.isOpen || false);
    }

    isOpen(){
        return this.get('isOpen');
    }

    openNode() {
        this.set('isOpen', true);
    }

    closeNode() {
        this.set('isOpen', false);
    }
}

module.exports = NodeBoard;
