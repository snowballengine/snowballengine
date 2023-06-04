import { EventTarget } from "@snowballengine/utils";
import { Module } from "../Module";
import { ModuleInstantiationError } from "../Error";

interface SceneOptions {
    modules: [Module, ...Module[]];
}

export type ApplyModuleToScene<S extends Scene, M extends Module> = S & {
    [name in M["name"]]: ReturnType<M["create"]>;
};

export type ApplyModulesToScene<S extends Scene, Modules extends [...Module[]]> = Modules extends [
    infer M extends Module,
    ...infer Remaining extends Module[]
]
    ? ApplyModulesToScene<ApplyModuleToScene<S, M>, Remaining>
    : S;

export type SceneEventTypes = {
    unload: [];
    unloaded: [];
    destroy: [];
};

export class Scene extends EventTarget<SceneEventTypes> {
    private readonly _modules: Record<string, object> = {};

    public addModule<const T extends Module>(module: T): ApplyModuleToScene<this, T> {
        if (module.name in this._modules) {
            throw new ModuleInstantiationError(`Module ${module.name} is already used in scene.`);
        }

        if (module.name in this) {
            throw new ModuleInstantiationError(`Property ${module.name} in scene is already used.`);
        }

        if (module.dependencies && !module.dependencies.every((dependency) => dependency.name in this)) {
            const missingDependencies = module.dependencies.filter(
                (dependency) => !(dependency.name in this)
            );

            throw new ModuleInstantiationError(
                `Module ${module.name} is missing dependencies: ${missingDependencies.join(", ")}`
            );
        }

        this._modules[module.name] = module.create(this._modules as never);

        (this as Record<string, unknown>)[module.name] = this._modules[module.name];

        return this as ApplyModuleToScene<this, T>;
    }
}

export function createScene<Options extends SceneOptions>(
    sceneOptions: Options
): ApplyModulesToScene<Scene, Options["modules"]> {
    return sceneOptions.modules.reduce(
        (scene, module) => scene.addModule(module),
        new Scene()
    ) as ApplyModulesToScene<Scene, Options["modules"]>;
}
