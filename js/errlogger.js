class ErrLogger {
    _onError = null
    _saveLogFn = null
    constructor() {

    }

    restore() {
        window.onerror = this._onError
    }

    init(saveLogFn, maxLogs = 100) {
        if (this._onError === null) {
            this._onError = window.onerror
        }
        if (typeof saveLogFn === 'function') {
           this._saveLogFn = saveLogFn
           let logs = ErrLogger.getLogs()
           if (logs && logs.session.length >= maxLogs) {
               this._saveLogFn()
               this.clearLogs()
           }
        }
        window.onerror = this._logError
    }

    static getKey() {
        return 'errLoggerSession'
    }
    static setLog(log) {
        sessionStorage.setItem(ErrLogger.getKey(), JSON.stringify(log))
    }

    static getLogs() {
        return JSON.parse(sessionStorage.getItem(ErrLogger.getKey()))
    }

    clearLogs() {
        sessionStorage.removeItem(ErrLogger.getKey())
    }

    static printLogs() {
        let logs = ErrLogger.getLogs()
        console.log(logs)
    }

    // possibly capture screenshot
    // record mouse position when error occurred
    _logError (msg, url, lineNo, columnNo, error) {
        let log = ErrLogger.getLogs()
        if (!log) {log = { session: [] } }
        log.session.push({
            timestamp: new Date().valueOf(),
            columnNo,
            error: error,
            lineNo,
            message: msg,
            url,
        })
        ErrLogger.setLog(log)
        return true
    }
}

const saveLogFn = () => console.log('save logs')

let logger = new ErrLogger()
logger.init(saveLogFn)