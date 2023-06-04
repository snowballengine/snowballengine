import type { Logger } from "../Logger";
import { EventTarget } from "../Events";
import { Interval } from "../Interval";
import type { Time } from "../Time";

export enum TickerState {
    Starting,
    Started,
    Running,
    Stopping,
    Stopped
}

type TickerEventsType = {
    start: [];
    beforeUpdate: [delta: number];
    update: [delta: number];
    afterUpdate: [delta: number];
    stop: [];
};

type RequestUpdate = (update: (time: number) => void) => number;
type CancelUpdate = (handle: number) => void;

export class Ticker extends EventTarget<TickerEventsType> {
    private _logger: Logger;
    private _time: Time;
    private _state: TickerStateManager;

    private _delta: number = 0;
    private _updateComplete = false;
    private _updateRequestHandle: number | undefined;
    private _previousUpdateTime: number = 0;

    private _requestUpdate: RequestUpdate;
    private _cancelUpdateRequest: CancelUpdate;

    public constructor(
        logger: Logger,
        time: Time,
        requestUpdate: RequestUpdate,
        cancelUpdateRequest: CancelUpdate
    ) {
        super();

        this._logger = logger;
        this._requestUpdate = requestUpdate;
        this._cancelUpdateRequest = cancelUpdateRequest;
        this._time = time;
        this._state = new TickerStateManager(TickerState.Stopped, logger);
    }

    public getDelta(): number {
        return this._delta;
    }

    public getState(): TickerState {
        return this._state.getState();
    }

    public start(): void {
        if (this._state.getState() !== TickerState.Stopped) {
            return;
        }

        this._state.setState(TickerState.Starting);

        this.dispatchEvent("start");

        this._state.setState(TickerState.Started);
        this._previousUpdateTime = this._time.now();
        this._updateRequestHandle = this._requestUpdate(this._update);
    }

    public async stop(): Promise<void> {
        if (this._state.getState() !== TickerState.Running) {
            return;
        }

        if (this._updateRequestHandle) {
            this._cancelUpdateRequest(this._updateRequestHandle);
            this._updateRequestHandle = undefined;
        }

        this._state.setState(TickerState.Stopping);

        await new Interval((clear) => {
            if (this._updateComplete) {
                clear();
            }
        }, 0).getPromise();

        this.dispatchEvent("stop");

        this._state.setState(TickerState.Stopped);
    }

    private _update = ((time: number): void => {
        if (
            this._state.getState() !== TickerState.Running &&
            this._state.getState() !== TickerState.Started
        ) {
            return;
        }

        this._logger.debug(`update start ${time}`);

        this._updateComplete = false;

        const delta = time - this._previousUpdateTime;

        this.dispatchEvent("beforeUpdate", delta);
        this.dispatchEvent("update", delta);
        this.dispatchEvent("afterUpdate", delta);

        if (this._updateRequestHandle) {
            this._updateRequestHandle = this._requestUpdate(this._update);
        }

        this._updateComplete = true;
        this._previousUpdateTime = time;

        if (this._state.getState() === TickerState.Started) {
            this._state.setState(TickerState.Running);
        }

        this._logger.debug(`update end ${time}`);
    }).bind(this);
}

class TickerStateManager {
    private _state: TickerState;
    private _logger: Logger;

    public constructor(initialState: TickerState, logger: Logger) {
        this._state = initialState;
        this._logger = logger;
    }

    public getState(): TickerState {
        return this._state;
    }

    public setState(newState: TickerState): void {
        this._logger.debug(`update ticker state ${this._state} -> ${newState}`);
        this._state = newState;
    }
}
