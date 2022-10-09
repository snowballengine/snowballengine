import { TickerState } from "./createTicker";
import { createTicker } from "./createTicker.mock";

describe("createTicker", () => {
    test("should correctly switch between states", async () => {
        const ticker = createTicker();

        expect(ticker.getState()).toEqual(TickerState.Stopped);

        const startHook = jest.fn();
        startHook.mockImplementation(() => {
            expect(ticker.getState()).toEqual(TickerState.Starting);
        });
        ticker.start(startHook);
        expect(startHook).toBeCalledTimes(1);
        expect(ticker.getState()).toEqual(TickerState.Started);

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(ticker.getState()).toEqual(TickerState.Running);

        const stopHook = jest.fn();
        stopHook.mockImplementation(() => {
            expect(ticker.getState()).toEqual(TickerState.Stopping);
        });
        await ticker.stop(stopHook);
        expect(stopHook).toBeCalledTimes(1);
        expect(ticker.getState()).toEqual(TickerState.Stopped);
    });
});
