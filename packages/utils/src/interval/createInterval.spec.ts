import { createInterval } from ".";

describe("createInterval", () => {
    test("should clear interval after first call", () => {
        let counter = 0;

        createInterval((clear) => {
            expect(++counter).toEqual(1);
            clear();
        }, 0);
    });

    test("should clear interval after 5th call and verify promise", async () => {
        let counter = 0;

        await createInterval(
            (clear) => {
                if (++counter === 5) {
                    clear();
                }
            },
            0,
            true
        );

        expect(counter).toEqual(5);
    });
});
