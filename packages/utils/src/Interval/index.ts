export class Interval {
    private _promise?: Promise<void>;
    private _resolvePromiseCb?: () => void;
    private _intervalHandle: number;

    public constructor(cb: (clear: () => void, counter: number) => void, ms: number) {
        let counter = 0;

        const clear = (): void => {
            clearInterval(this._intervalHandle);
            this._resolvePromiseCb?.();
        };

        this._intervalHandle = window.setInterval(() => {
            cb(clear, counter++);
        }, ms);
    }

    public getPromise(): Promise<void> {
        if (!this._promise) {
            this._promise = new Promise<void>((resolve) => {
                this._resolvePromiseCb = resolve;
            });
        }

        return this._promise;
    }
}
