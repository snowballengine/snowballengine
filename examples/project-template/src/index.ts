import { createCreateScene } from "@snowballengine/core";
import { createCreateLogger, createCreateTicker, createInterval, LogLevel } from "@snowballengine/utils";

const createLogger = createCreateLogger(LogLevel.Debug, console);
const createTicker = createCreateTicker(
    createLogger,
    createInterval,
    requestAnimationFrame,
    cancelAnimationFrame
);

const createScene = createCreateScene(createTicker);

const scene = createScene();

// // add S, G, C types
// interface Module<Name extends string, S = undefined, G = undefined, C = undefined> {
//     name: Name;
//     forScene?: (scene: CreateScene) => S;
//     forGameObject?: (gameObject: never) => G;
//     forComponent?: (component: never) => C;
// }
//
// interface SceneOptions {
//     modules: <Name extends string, S, G, C>() => Module<Name, S, G, C>[];
// }
//
// class SnowballEngine {
//     private _sceneOptions: string[];
//     private _scenes: Record<string, CreateScene>;
//
//     addScene(name: string, sceneOptions: Partial<SceneOptions> = {}) {
//         return this;
//     }
// }
//
// new SnowballEngine().addScene("CreateScene Name");
//
// class FrameData {
//     getFps() {
//         return 0;
//     }
// }
//
// class FrameDataModule implements Module<"frameData", FrameData> {
//     name = "frameData" as const;
//     forScene(scene: CreateScene) {
//         return new FrameData();
//     }
// }
//
// export type { SnowballEngine };
