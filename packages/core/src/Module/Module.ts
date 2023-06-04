export interface Module<
    Name extends string = string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Dependencies extends readonly Module[] = readonly Module<string, any, object, Record<string, object>>[],
    ModuleInstance extends object = object,
    MutatedDependencies extends Record<string, object> = Record<string, object>
> {
    readonly name: Name;
    readonly dependencies: Dependencies;

    create(dependencies: MutatedDependencies): ModuleInstance;
    dispose?(module: ModuleInstance): void;
}

export function createModule<
    const Name extends string,
    const Dependencies extends readonly Module[],
    const ModuleInstance extends object,
    MutatedDependencies extends {
        [K in keyof Dependencies & number as Dependencies[K] extends Pick<Module, "name">
            ? Dependencies[K]["name"]
            : `${K}_failed`]: Dependencies[K] extends Pick<Module, "create">
            ? ReturnType<Dependencies[K]["create"]>
            : { failed: `${K}_failed` };
    }
>(
    name: Name,
    dependencies: Dependencies,
    create: (deps: MutatedDependencies) => ModuleInstance,
    dispose: (moduleInstance: ModuleInstance) => void = (): void => undefined
): Module<Name, Dependencies, ModuleInstance, MutatedDependencies> {
    return {
        name,
        dependencies,
        create,
        dispose
    };
}
