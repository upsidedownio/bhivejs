const _ = require('lodash');
const {defaultBehaviorTreeOptions} = require('../constants');

/**
 * There are two types of logger
 * 1. logger for logging debug messages in this library
 * 2. logger for logging customizable user log
 */

/**
 * Default Log levels - syslog
 * @see RFC 5424: https://www.rfc-editor.org/info/rfc5424
 * @typedef {'emerg'|'alert'|'crit'|'err'|'warning'|'notice'|'info'|'debug'} SYSLOG_LEVEL
 */

/**
 * Default logger
 * @param tick
 * @param level
 * @param message
 * @param extra
 */

/**
 * @typedef {function} LogFunction
 */

/**
 * @constant
 * @type {{emerg: number, debug: number, crit: number, err: number, alert: number, warning: number, notice: number, info: number}}
 */
const severities = {
    emerg: 1,
    alert: 2,
    crit: 3,
    err: 4,
    warning: 5,
    notice: 6,
    info: 7,
    debug: 8
};

/**
 * @class Logger
 */
class Logger {
    /**
     * @param {Context|{debug: boolean, debug_level: string}} context
     * @param {LogFunction} logger
     */
    constructor(context, logger) {
        this.context = context;
        this.options = _.defaults(context.options, defaultBehaviorTreeOptions);

        this._log = logger || this.default_logger;
        this._debugLog = this.options.debug && this.options.customLoggerForDebug ? logger || this.default_logger : this.default_logger;

        // expends log
        // for (const level in severities) {
        //     this[level] = function (message, extra) {
        //         return this.log(level, message, extra)
        //     };
        //     this['DEBUG_' + level] = function (message, extra) {
        //         return this.debugLog(level, message, extra);
        //     };
        // }
    }

    /**
     * @type {Logger}
     */
    get logger() {
        return this._log;
    }

    set logger(logger) {
        this._log = logger;
    }

    /**
     * @type {Logger}
     */
    get debugLogger() {
        return this._debugLog;
    }

    set debugLogger(dlogger) {
        this._debugLog = dlogger;
    }

    checkDebugLogLevel(context, level) {
        const level_debug = _.get(severities, _.get(this.context, 'debug_level')) || severities['warning'];
        const level_log = _.get(severities, level) || _.get(severities, 'emerg');

        if (!_.get(severities, level)) {
            console.warn('invalid log level ' + level, console.trace());
        }

        return (context.debug && (level_log <= level_debug));
    }

    /**
     * @param {SYSLOG_LEVEL} level
     * @param {string} message
     * @param {object} [extra]
     * @returns {*}
     */
    debugLog(level, message, extra) {
        if (this.checkDebugLogLevel(this.context, level)) {
            return this._debugLog(level, message, extra)
        }
    }

    /**
     * @param {SYSLOG_LEVEL} level
     * @param {string} message
     * @param {object} [extra]
     * @returns {*}
     */
    log(level, message, extra) {
        return this._log(level, message, extra);
    }

    /**
     * @param {string} level
     * @param {string} message
     * @param {object} [extra]
     * @private
     */
    default_logger(level, message, extra) {
        let msg = `${level}: ${message}`;
        if (extra) {
            msg += `\n${JSON.stringify(extra, null, 4)}`;
        }
        switch (level) {
            case 'emerg':
            case 'alert':
            case 'crit':
            case 'err':
                return console.error(msg);
            case 'warning':
            case 'notice':
                return console.warn(msg);
            case 'info':
                return console.info(msg);
            case 'debug':
            default:
                return console.log(msg);
        }
    }

    debug(message, extra) {
        this.log('debug', message, extra);
    }

    info(message, extra) {
        this.log('info', message, extra);
    }

    notice(message, extra) {
        this.log('notice', message, extra);
    }

    warning(message, extra) {
        this.log('warning', message, extra);
    }

    err(message, extra) {
        this.log('err', message, extra);
    }

    crit(message, extra) {
        this.log('crit', message, extra);
    }

    alert(message, extra) {
        this.log('alert', message, extra);
    }

    emerg(message, extra) {
        this.log('emerg', message, extra);
    }

    // debug logger
    DEBUG_debug(message, extra) {
        this.debugLog('debug', message, extra);
    }

    DEBUG_info(message, extra) {
        this.debugLog('info', message, extra);
    }

    DEBUG_notice(message, extra) {
        this.debugLog('notice', message, extra);
    }

    DEBUG_warning(message, extra) {
        this.debugLog('warning', message, extra);
    }

    DEBUG_err(message, extra) {
        this.debugLog('err', message, extra);
    }

    DEBUG_crit(message, extra) {
        this.debugLog('crit', message, extra);
    }

    DEBUG_alert(message, extra) {
        this.debugLog('alert', message, extra);
    }

    DEBUG_emerg(message, extra) {
        this.debugLog('emerg', message, extra);
    }
}

module.exports = Logger;
