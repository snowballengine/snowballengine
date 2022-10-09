type CreateIntervalReturnType<P extends boolean> = P extends true ? Promise<void> : void;

export type CreateIntervalType = <P extends boolean = false>(
    cb: (clear: () => void, counter: number) => void,
    ms: number,
    promisify?: P
) => CreateIntervalReturnType<P>;

export const createInterval: CreateIntervalType = <P extends boolean = false>(
    cb: (clear: () => void, counter: number) => void,
    ms: number,
    promisify: P = false as P
): CreateIntervalReturnType<P> => {
    let counter = 0;
    const handle = setInterval(() => {
        cb(clear, counter++);
    }, ms);

    let resolvePromise: () => void;

    function clear() {
        clearInterval(handle);
        resolvePromise?.();
    }

    if (!promisify) {
        return undefined as CreateIntervalReturnType<P>;
    }

    return new Promise<void>((resolve) => {
        resolvePromise = resolve;
    }) as CreateIntervalReturnType<P>;
};
