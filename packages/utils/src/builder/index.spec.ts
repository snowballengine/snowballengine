import { builder } from ".";

describe("builder", () => {
    interface Test {
        abc: string;
        def?: number;
        ghi?: boolean;
    }

    test("should build an empty object", () => {
        const result = builder<Test>()();

        expect(result).toMatchObject({});
    });

    test("should build an object from base object", () => {
        const obj: Test = { abc: "123" };
        const result = builder(obj)();

        expect(result).toMatchObject(obj);
    });

    test("should build an object from base object with added property", () => {
        const obj = { abc: "123" } as const;
        const result = builder<Test, typeof obj>(obj)("def", 123)();

        const expected = { ...obj, def: 123 };
        expect(result).toMatchObject(expected);
    });

    test("should build an object from base object with added properties", () => {
        const obj: Test = { abc: "123" };
        const result = builder<Test>(obj)("def", 123)("ghi", false)();

        const expected: Test = { ...obj, def: 123, ghi: false };
        expect(result).toMatchObject(expected);
    });

    test("should build an object from extended base object with added property", () => {
        const obj: Test = { abc: "123", def: 123 };
        const result = builder<Test>(obj)("ghi", false)();

        const expected: Test = { ...obj, ghi: false };
        expect(result).toMatchObject(expected);
    });
});
