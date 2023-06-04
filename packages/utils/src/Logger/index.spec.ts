import { Logger, LogLevel } from ".";

describe("Logger", () => {
    test.each([
        [LogLevel.None, 0, 0, 0, true],
        [LogLevel.Error, 1, 0, 0, true],
        [LogLevel.Info, 1, 1, 0, true],
        [LogLevel.Debug, 1, 1, 1, true],
        [LogLevel.None, 0, 0, 0, false],
        [LogLevel.Error, 1, 0, 0, false],
        [LogLevel.Info, 1, 1, 0, false],
        [LogLevel.Debug, 1, 1, 1, false],
        [LogLevel.None, 0, 0, 0, true],
        [LogLevel.Error, 1, 0, 0, true],
        [LogLevel.Info, 1, 1, 0, true],
        [LogLevel.Debug, 1, 1, 1, true],
        [LogLevel.None, 0, 0, 0, false],
        [LogLevel.Error, 1, 0, 0, false],
        [LogLevel.Info, 1, 1, 0, false],
        [LogLevel.Debug, 1, 1, 1, false]
    ])(
        "should log using different LogLevels and a logging namespace",
        (
            logLevel: LogLevel,
            timesCalledError: number,
            timesCalledInfo: number,
            timesCalledDebug: number,
            useLogNamespace: boolean
        ) => {
            const loggerMock = {
                info: vi.fn(),
                error: vi.fn(),
                debug: vi.fn()
            };

            const logNamespace = undefined;
            const log1 = "test log 1";
            const log2 = "test log 2";
            const logger = new Logger(logLevel, loggerMock, useLogNamespace ? logNamespace : undefined);

            logger.error(log1, log2);
            expect(loggerMock.error).toBeCalledTimes(timesCalledError);

            logger.info(log1, log2);
            expect(loggerMock.info).toBeCalledTimes(timesCalledInfo);

            logger.debug(log1, log2);
            expect(loggerMock.debug).toBeCalledTimes(timesCalledDebug);

            const expectedArgs = [useLogNamespace && logNamespace, log1, log2].filter(Boolean);

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
