// node categories
const COMPOSITE = 'composite';
const DECORATOR = 'decorator';
const TASK = 'task';

// result status of nodes
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const RUNNING = 'RUNNING';
const ERROR = 'ERROR';

/**
 * @typedef {string} Constant
 */


/**
 * @typedef {Object} BehaviorTreeOptions
 * @property {boolean}     [debug]
 * @property {SYSLOG_LEVEL}[debug_level]
 * @property {LogFunction} [logger]
 * @property {SYSLOG_LEVEL}[log_level]
 */

/**
 * @type {BehaviorTreeOptions}
 */
const defaultBehaviorTreeOptions = {
    debug: false,
    debug_level: 'emerg',
    logger: null,
    log_level: 'warning',
    customLoggerForDebug: false
};

/**
 * @type {Array<Constant>}
 */
module.exports = {
    SUCCESS,
    FAILURE,
    RUNNING,
    ERROR,
    COMPOSITE,
    DECORATOR,
    TASK,
    defaultBehaviorTreeOptions
};
