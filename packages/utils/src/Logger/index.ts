export interface LoggerBase {
    error(...data: unknown[]): void;
    info(...data: unknown[]): void;
    debug(...data: unknown[]): void;
}

export enum LogLevel {
    None,
    Error,
    Info,
    Debug
}

export class Logger implements LoggerBase {
    private readonly _infoAllowed: boolean;
    private readonly _errorAllowed: boolean;
    private readonly _debugAllowed: boolean;
    private readonly _logNamespace: string;
    private readonly _logger: LoggerBase;

    public constructor(logLevel: LogLevel, logger: LoggerBase, logNamespace?: string) {
        this._errorAllowed = logLevel >= LogLevel.Error;
        this._infoAllowed = logLevel >= LogLevel.Info;
        this._debugAllowed = logLevel === LogLevel.Debug;
        this._logNamespace = logNamespace ?? "";

        this._logger = logger;
    }

    public info(...data: unknown[]): void {
        if (this._infoAllowed) {
            if (this._logNamespace) {
                this._logger.info(this._logNamespace, ...data);
            } else {
                this._logger.info(...data);
            }
        }
    }

    public error(...data: unknown[]): void {
        if (this._errorAllowed) {
            if (this._logNamespace) {
                this._logger.error(this._logNamespace, ...data);
            } else {
                this._logger.error(...data);
            }
        }
    }

    public debug(...data: unknown[]): void {
        if (this._debugAllowed) {
            if (this._logNamespace) {
                this._logger.debug(this._logNamespace, ...data);
            } else {
                this._logger.debug(...data);
            }
        }
    }
}
