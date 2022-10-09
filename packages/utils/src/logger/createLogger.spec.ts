import { createCreateLogger, LogLevel } from "./createLogger";

describe("createLogger", () => {
    test.each([
        [LogLevel.None, 0, 0, 0, true],
        [LogLevel.Info, 1, 0, 0, true],
        [LogLevel.Error, 1, 1, 0, true],
        [LogLevel.Debug, 1, 1, 1, true],
        [LogLevel.None, 0, 0, 0, false],
        [LogLevel.Info, 1, 0, 0, false],
        [LogLevel.Error, 1, 1, 0, false],
        [LogLevel.Debug, 1, 1, 1, false]
    ])(
        "should log using different LogLevels and a logging namespace",
        (
            logLevel: LogLevel,
            timesCalledInfo: number,
            timesCalledError: number,
            timesCalledDebug: number,
            useLogNamespace: boolean
        ) => {
            const loggerMock = {
                info: jest.fn(),
                error: jest.fn(),
                debug: jest.fn()
            };
            const createLogger = createCreateLogger(logLevel, loggerMock);

            const logNamespace = "test log namespace";
            const log1 = "test log 1";
            const log2 = "test log 2";
            const logger = createLogger(useLogNamespace ? logNamespace : undefined);

            logger.info(log1, log2);
            expect(loggerMock.info).toBeCalledTimes(timesCalledInfo);

            logger.error(log1, log2);
            expect(loggerMock.error).toBeCalledTimes(timesCalledError);

            logger.debug(log1, log2);
            expect(loggerMock.debug).toBeCalledTimes(timesCalledDebug);

            const expectedArgs = [useLogNamespace && `[${logNamespace}]`, log1, log2].filter(Boolean);

            if (timesCalledInfo) {
                expect(loggerMock.info).toBeCalledWith(...expectedArgs);
            }
            if (timesCalledError) {
                expect(loggerMock.error).toBeCalledWith(...expectedArgs);
            }
            if (timesCalledDebug) {
                expect(loggerMock.debug).toBeCalledWith(...expectedArgs);
            }
        }
    );
});
