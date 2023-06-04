import { Ticker } from "@snowballengine/utils";
import { LoggerModule } from "../LoggerModule";
import { createModule } from "@snowballengine/core";

export const TickerModule = createModule(
    "ticker",
    [LoggerModule],
    (dependencies): Ticker =>
        new Ticker(
            dependencies.logger,
            performance,
            requestAnimationFrame.bind(window),
            cancelAnimationFrame.bind(window)
        )
);
