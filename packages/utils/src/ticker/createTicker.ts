import type { CreateLoggerType, Logger } from "../logger";
import type { CreateIntervalType } from "../interval";
import { createEventTarget, EventsType, EventTarget } from "../events";
import { builder } from "../builder";

export enum TickerState {
    Starting,
    Started,
    Running,
    Stopping,
    Stopped
}

export interface Ticker extends EventTarget<TickerEventsType> {
    getDelta(): number;
    getState(): TickerState;
    start(hook?: () => void): void;
    stop(hook?: () => Promise<void> | void): Promise<void>;
}
export interface TickerEventsType extends EventsType {
    update: [delta: number];
}

type RequestUpdate = (update: (time: number) => void) => number;
type CancelUpdate = (handle: number) => void;

export type CreateTickerType = () => Ticker;
export type CreateCreateTickerType = (
    createLogger: CreateLoggerType,
    createInterval: CreateIntervalType,
    requestUpdate: RequestUpdate,
    cancelUpdateRequest: CancelUpdate
) => CreateTickerType;

export const createCreateTicker: CreateCreateTickerType = (
    createLogger: CreateLoggerType,
    createInterval: CreateIntervalType,
    requestUpdate: RequestUpdate,
    cancelUpdateRequest: CancelUpdate
): CreateTickerType => {
    return (): Ticker => {
        const logger = createLogger("Ticker");
        const events = createEventTarget<TickerEventsType>();
        const [getState, setState] = createTickerState(TickerState.Stopped, logger);

        let updateComplete = false;
        let updateRequestHandle: number | undefined;
        let previousUpdateTime: number;
        let delta: number;

        const update = (time: number): void => {
            if (getState() !== TickerState.Running && getState() !== TickerState.Started) {
                return;
            }

            logger.debug("update start ", time);

            updateComplete = false;

            const delta = time - previousUpdateTime;

            events.dispatchEvent("update", delta);

            if (updateRequestHandle) {
                updateRequestHandle = requestUpdate(update);
            }

            updateComplete = true;
            previousUpdateTime = time;

            if (getState() === TickerState.Started) {
                setState(TickerState.Running);
            }

            logger.debug("update end ", time);
        };

        return builder<Ticker, EventTarget<TickerEventsType>>(events)("getDelta", () => delta)(
            "getState",
            () => getState()
        )("start", (hook) => {
            if (getState() !== TickerState.Stopped) {
                return;
            }

            setState(TickerState.Starting);

            hook?.();

            setState(TickerState.Started);
            previousUpdateTime = performance.now();
            updateRequestHandle = requestUpdate(update);
        })("stop", async (hook?: () => Promise<void> | void) => {
            if (getState() !== TickerState.Running) {
                return;
            }

            if (updateRequestHandle) {
                cancelUpdateRequest(updateRequestHandle);
                updateRequestHandle = undefined;
            }

            setState(TickerState.Stopping);

            await createInterval(
                (clear) => {
                    if (updateComplete) {
                        clear();
                    }
                },
                0,
                true
            );

            await hook?.();

            setState(TickerState.Stopped);
        })();
    };
};

const createTickerState = (
    initialState: TickerState,
    logger: Logger
): [getState: () => TickerState, setState: (state: TickerState) => void] => {
    let state = initialState;

    const getState = (): TickerState => state;
    const setState = (newState: TickerState) => {
        logger.info(`update state: ${state} -> ${newState}`);
        state = newState;
    };

    return [getState, setState];
};
