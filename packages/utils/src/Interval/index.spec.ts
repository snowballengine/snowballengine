import { Interval } from ".";

describe("Interval", () => {
    test("should clear interval after first call", () => {
        let counter = 0;

        new Interval((clear) => {
            expect(++counter).toEqual(1);
            clear();
        }, 0);
    });

    test("should clear interval after 5th call and verify promise", async () => {
        let counter = 0;

        await new Interval((clear) => {
            if (++counter === 5) {
                clear();
            }
        }, 0).getPromise();

        expect(counter).toEqual(5);
    });
});
