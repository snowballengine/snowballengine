export type RequireKey<T extends object, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type OptionalKeys<T extends object> = ReturnType<
    <
        X extends {
            [K in keyof T]: T extends Record<K, T[K]> ? never : K;
        }
    >() => X[keyof X]
>;
export type PickOptional<T extends object> = Pick<T, RequiredKeys<T>>;

export type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;
export type PickRequired<T extends object> = Pick<T, RequiredKeys<T>>;

export type DeepReadonly<T> = T extends never[]
    ? DeepReadonlyArray<T[number]>
    : T extends object
    ? DeepReadonlyObject<T>
    : T;
type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;
type DeepReadonlyObject<T> = T & { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type DeepMutable<T> = T extends never[]
    ? DeepMutableArray<T[number]>
    : T extends object
    ? DeepMutableObject<T>
    : T;
type DeepMutableArray<T> = Array<DeepMutable<T>>;
type DeepMutableObject<T> = T & { -readonly [P in keyof T]: DeepMutable<T[P]> };
