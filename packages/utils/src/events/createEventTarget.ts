export type EventsType = { [key: string]: unknown[] };
export type EventHandler<T extends unknown[]> = (...args: T) => void;

export interface EventTarget<T extends EventsType> {
    addListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void;
    removeListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void;
    dispatchEvent<K extends keyof T>(eventName: K, ...args: T[K]): void;

    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    getEventPromise<K extends keyof T>(eventName: K): Promise<T[K]>;
}

export function createEventTarget<T extends EventsType = never>(): EventTarget<T> {
    const events: { [K in keyof T]?: EventHandler<T[K]>[] } = {};

    return {
        addListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void {
            events[eventName] ??= [];
            events[eventName]!.push(handler);
        },
        removeListener<K extends keyof T>(eventName: K, handler: EventHandler<T[K]>): void {
            if (events[eventName]) {
                const index = events[eventName]!.indexOf(handler);
                events[eventName]!.splice(index, 1);
            }
        },
        dispatchEvent<K extends keyof T>(eventName: K, ...args: T[K]): void {
            if (events[eventName]) {
                for (const handler of events[eventName]!) {
                    handler(...args);
                }
            }
        },
        getEventPromise<K extends keyof T>(eventName: K): Promise<T[K]> {
            return new Promise((resolve) => {
                const handler = (...args: T[K]) => {
                    this.removeListener(eventName, handler);
                    resolve(args);
                };

                this.addListener(eventName, handler);
            });
        }
    };
}
