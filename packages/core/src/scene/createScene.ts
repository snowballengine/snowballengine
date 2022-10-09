import type { CreateTickerType, Ticker } from "@snowballengine/utils";
import { builder } from "@snowballengine/utils";

export interface Scene {
    getTicker(): SceneTicker;
    start(): void;
    stop(): Promise<void>;
}

export type SceneTicker = Omit<Ticker, "start" | "stop">;

export type CreateCreateSceneType = (createTicker: CreateTickerType) => CreateSceneType;
export type CreateSceneType = () => Scene;

export const createCreateScene: CreateCreateSceneType = (createTicker: CreateTickerType): CreateSceneType => {
    return (): Scene => {
        const ticker = createTicker();

        return builder<Scene, Ticker>(ticker)("getTicker", () => ticker)("start", () => ticker.start())(
            "stop",
            () => ticker.stop()
        )();
    };
};
