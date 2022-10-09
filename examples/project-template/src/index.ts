import { createCreateScene, Scene } from "@snowballengine/core";
import {
    builder,
    createCreateLogger,
    createCreateTicker,
    createInterval,
    LogLevel
} from "@snowballengine/utils";

const createLogger = createCreateLogger(LogLevel.Debug, console);
const createTicker = createCreateTicker(
    createLogger,
    createInterval,
    requestAnimationFrame,
    cancelAnimationFrame
);

const createScene = createCreateScene(createTicker);

const scene = createScene();

interface Module {
    applyToScene<T extends Scene>(scene: T): ApplyModuleToScene<Scene, object>;

    forScene?: (scene: Scene) => unknown;
    // forGameObject?: (gameObject: never) => unknown;
    // forComponent?: (component: never) => unknown;
}

class FrameData {
    getFps() {
        return 0;
    }
}

type ApplyModuleToScene<T extends Scene, U extends object> = Omit<U, keyof T> & T;

class FrameDataModule implements Module {
    applyToScene<T extends Scene>(scene: T): ApplyModuleToScene<T, { frameData: FrameData }> {
        const _scene: T & { frameData?: FrameData } = scene;

        if (!("frameData" in _scene)) {
            _scene.frameData = new FrameData();
        }

        return _scene as ApplyModuleToScene<T, { frameData: FrameData }>;
    }
}

class SecondModule implements Module {
    applyToScene<T extends Scene>(scene: T): ApplyModuleToScene<T, { test: number }> {
        const _scene: T & { test?: number } = scene;

        if (!("test" in _scene)) {
            _scene.test = 123;
        }

        return _scene as ApplyModuleToScene<T, { test: number }>;
    }
}

class ThirdModule implements Module {
    applyToScene<T extends Scene>(scene: T): ApplyModuleToScene<T, { test1: number }> {
        const _scene: T & { test1?: number } = scene;

        if (!("test1" in _scene)) {
            _scene.test1 = 123;
        }

        return _scene as ApplyModuleToScene<T, { test1: number }>;
    }
}

interface SceneOptions {
    modules: [Module, ...Module[]];
}

type MergeModulesToScene<Modules extends [Module, ...Module[]], S extends Scene = Scene> = Modules extends [
    infer X extends Module,
    ...Module[]
]
    ? Modules extends [X, ...infer Y extends [Module, ...Module[]]]
        ? MergeModulesToScene<Y, MergeModuleToScene<X, S>>
        : MergeModuleToScene<X, S>
    : never;

type MergeModuleToScene<M extends Module, S extends Scene> = ReturnType<
    M["applyToScene"]
> extends ApplyModuleToScene<Scene, infer X>
    ? ApplyModuleToScene<S, X>
    : never;

class SnowballEngine {
    static createSceneFromModules<Options extends SceneOptions>(
        sceneOptions: Options
    ): MergeModulesToScene<Options["modules"], Scene> {
        return sceneOptions.modules.reduce(
            (scene, module) => module.applyToScene(scene),
            createScene()
        ) as MergeModulesToScene<Options["modules"], Scene>;
    }
}

const bla = SnowballEngine.createSceneFromModules({
    modules: [new FrameDataModule(), new FrameDataModule(), new SecondModule(), new ThirdModule()]
});
bla.frameData;
