import { createCreateTicker, CreateTickerType, Ticker } from "./createTicker";
import { createInterval } from "../interval";

export const createTicker: CreateTickerType = (): Ticker => {
    let shouldUpdate = true;

    return createCreateTicker(
        () => ({ info: () => void 0, error: () => void 0, debug: () => void 0 }),
        createInterval,
        (cb) => {
            if (!shouldUpdate) {
                shouldUpdate = true;
                return 0;
            }

            setTimeout(() => cb(100), 0);

            return 1;
        },
        () => {
            shouldUpdate = false;
        }
    )();
};
