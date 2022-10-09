export interface Logger {
    info(...data: unknown[]): void;
    error(...data: unknown[]): void;
    debug(...data: unknown[]): void;
}

export enum LogLevel {
    None,
    Info,
    Error,
    Debug
}

export type CreateCreateLoggerType = (logLevel: LogLevel, logger: Logger) => CreateLoggerType;
export type CreateLoggerType = (logNamespace?: string) => Logger;

export const createCreateLogger: CreateCreateLoggerType = (
    logLevel: LogLevel,
    logger: Logger
): CreateLoggerType => {
    const infoAllowed = logLevel >= LogLevel.Info;
    const errorAllowed = logLevel >= LogLevel.Error;
    const debugAllowed = logLevel === LogLevel.Debug;

    return (logNamespace?: string): Logger => {
        const namespace = logNamespace && `[${logNamespace}]`;

        return {
            info(...data: unknown[]) {
                if (infoAllowed) {
                    if (logNamespace) {
                        logger.info(namespace, ...data);
                    } else {
                        logger.info(...data);
                    }
                }
            },
            error(...data: unknown[]) {
                if (errorAllowed) {
                    if (logNamespace) {
                        logger.error(namespace, ...data);
                    } else {
                        logger.error(...data);
                    }
                }
            },
            debug(...data: unknown[]) {
                if (debugAllowed) {
                    if (logNamespace) {
                        logger.debug(namespace, ...data);
                    } else {
                        logger.debug(...data);
                    }
                }
            }
        };
    };
};
