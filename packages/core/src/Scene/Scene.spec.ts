import { createModule } from "../Module";
import { ApplyModulesToScene, Scene } from "./Scene";

type TestModule1Type = { test: () => number };
type TestModule2Type = { test: () => boolean };

const TestModule1 = createModule("test1", [], () => ({ test: () => 0 } as TestModule1Type));
const TestModule2 = createModule("test2", [TestModule1], () => ({ test: () => false } as TestModule2Type));

describe("Scene", () => {
    it("should apply modules to scene", () => {
        type TestScene = ApplyModulesToScene<Scene, [typeof TestModule1, typeof TestModule2]>;

        expectTypeOf<TestScene["test1"]>().toEqualTypeOf<TestModule1Type>();
        expectTypeOf<TestScene["test2"]>().toEqualTypeOf<TestModule2Type>();
    });
});
