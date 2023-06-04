export type EventsType = { [key: string]: unknown[] };
export type EventHandler<T extends unknown[]> = (...args: T) => void;

const Events = Symbol("events");

export class EventTarget<T extends EventsType = EventsType> {
    private [Events]: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

    public addListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void {
        this[Events][eventName] ??= [];
        this[Events][eventName]!.push(handler);
    }

    public removeListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void {
        if (this[Events][eventName]) {
            const handlersLength = this[Events][eventName]!.length;

            for (let index = 0; index < handlersLength; index++) {
                if (this[Events][eventName]![index] === handler) {
                    this[Events][eventName]!.splice(index, 1);
                }
            }
        }
    }

    public dispatchEvent<K extends keyof T>(eventName: K, ...args: T[K]): void {
        if (this[Events][eventName]) {
            for (const handler of this[Events][eventName]!) {
                handler(...args);
            }
        }
    }

    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    public getEventPromise<K extends keyof T>(eventName: K): Promise<T[K]> {
        return new Promise((resolve) => {
            const handler = (...args: T[K]): void => {
                this.removeListener(eventName, handler);
                resolve(args);
            };

            this.addListener(eventName, handler);
        });
    }
}
