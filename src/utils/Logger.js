const _ = require('lodash');

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
 * @typedef {function} Logger
 */

/**
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
     * @param {Logger} logger
     */
    constructor(context, logger) {
        this.context = context;
        if (logger) {
            this._log = logger;
        }

        for (const level in severities) {
            this[level] = function (message, extra) {
                return this.log(level, message, extra)
            }
        }
    }

    set logger(logger) {
        this._log = logger;
    }

    checkLogLevel(context, level) {
        const level_debug = _.get(severities, _.get(this.context, 'debug_level')) || severities['warning'];
        const level_log = _.get(severities, level) || _.get(severities, 'emerg');

        if (!_.get(severities, level)) {
            console.warn('invalid log level ' + level, console.trace());
        }

        return (context.debug && (level_log <= level_debug));
    }

    log(level, message, extra) {
        if (this.checkLogLevel(this.context, level)) {
            return this._log(level, message, extra)
        }
    }

    /**
     * @param {string} level
     * @param {string} message
     * @param {object} [extra]
     * @private
     */
    _log(level, message, extra) {
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

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    debug(message, extra) {
        this.log('debug', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    info(message, extra) {
        this.log('info', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    notice(message, extra) {
        this.log('notice', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    warning(message, extra) {
        this.log('warning', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    err(message, extra) {
        this.log('err', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    crit(message, extra) {
        this.log('crit', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    alert(message, extra) {
        this.log('alert', message, extra);
    }

    /**
     * @param {string} [message]
     * @param {*} [extra]
     * @returns {*}
     */
    emerg(message, extra) {
        this.log('emerg', message, extra);
    }
}

module.exports = Logger;
