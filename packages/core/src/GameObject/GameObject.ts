import { EventTarget } from "@snowballengine/utils";

export type GameObjectEventTypes = {
    // componentadd: [component: Component<ComponentEventTypes>];
    // componentremove: [component: Component<ComponentEventTypes>];
    childadd: [child: GameObject];
    childremove: [child: GameObject];
    parentchanged: [newParent: GameObject | undefined];
};

export class GameObject extends EventTarget<GameObjectEventTypes> {}
