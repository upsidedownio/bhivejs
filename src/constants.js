/**
 * Unique identifier of node. It uses the UUID format.
 * @see RFC4122: https://tools.ietf.org/html/rfc4122
 * @typedef {string} NodeId
 */

/** @typedef {'TASK'|'COMPOSITE'|'CONDITION'|'DECORATOR'}   NodeCategory */
const COMPOSITE = 'composite';
const DECORATOR = 'decorator';
const TASK = 'task';

/** @typedef {'SUCCESS'|'FAILURE'|'RUNNING'|'ERROR'}        NodeStatus */
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const RUNNING = 'RUNNING';
const ERROR = 'ERROR';

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
