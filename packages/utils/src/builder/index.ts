import type { OptionalKeys, PickRequired, RequiredKeys, RequireKey } from "../types";

type Builder<T extends object> = (<
    K extends OptionalKeys<T>,
    V extends Required<T>[K],
    R extends RequireKey<T, K>
>(
    key: K,
    value: V
) => Builder<R>) &
    (() => T);

export function builder<T extends object, U extends object>(
    obj: U
): Builder<PickRequired<U> & Partial<Omit<T, RequiredKeys<U>>>>;
export function builder<T extends object>(obj: T): Builder<T>;
export function builder<T extends object>(): Builder<Partial<T>>;
export function builder<T extends object>(obj: T = Object.create(null) as T): Builder<T> {
    return (<K extends keyof T, V extends T[K]>(...args: [key: K, value: V] | []) => {
        if (args.length) {
            obj[args[0]] = args[1];
            return builder(obj);
        }

        return obj;
    }) as Builder<T>;
}
