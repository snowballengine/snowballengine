import { Ticker, TickerState } from ".";
import { Logger, LogLevel } from "../Logger";

describe("Ticker", () => {
    test("should correctly switch between states", async () => {
        const ticker = getMockedTicker();

        expect(ticker.getState()).toEqual(TickerState.Stopped);

        const startHook = vi.fn();
        startHook.mockImplementation(() => {
            expect(ticker.getState()).toEqual(TickerState.Starting);
        });
        ticker.addListener("start", startHook);
        ticker.start();
        expect(startHook).toBeCalledTimes(1);
        expect(ticker.getState()).toEqual(TickerState.Started);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(ticker.getState()).toEqual(TickerState.Running);

        const stopHook = vi.fn();
        stopHook.mockImplementation(() => {
            expect(ticker.getState()).toEqual(TickerState.Stopping);
        });
        ticker.addListener("stop", stopHook);
        await ticker.stop();
        expect(stopHook).toBeCalledTimes(1);
        expect(ticker.getState()).toEqual(TickerState.Stopped);
    });
});

function getMockedTicker(): Ticker {
    let shouldUpdate = true;

    return new Ticker(
        new Logger(LogLevel.None, console),
        performance,
        (update) => {
            if (!shouldUpdate) {
                shouldUpdate = true;
                return 0;
            }

            return window.setTimeout(() => update(10), 10);
        },
        (handle) => {
            shouldUpdate = false;
            window.clearTimeout(handle);
        }
    );
}
