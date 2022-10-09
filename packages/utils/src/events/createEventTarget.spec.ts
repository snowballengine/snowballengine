import { createEventTarget } from "./createEventTarget";

type Events = { change: [data: number] };

describe("events", () => {
    const data = 123456789;

    it("should add and remove listener from an EventTarget and dispatch events", () => {
        const instance = createEventTarget<Events>();

        const handler = jest.fn();

        instance.addListener("change", handler);
        expect(handler).toBeCalledTimes(0);

        instance.dispatchEvent("change", data);
        expect(handler).toBeCalledTimes(1);
        expect(handler).toBeCalledWith(data);

        instance.removeListener("change", handler);

        instance.dispatchEvent("change", data);
        expect(handler).toBeCalledTimes(1);
    });

    it("should use getEventPromise", async () => {
        const instance = createEventTarget<Events>();

        const promise = instance.getEventPromise("change");

        instance.dispatchEvent("change", data);

        expect(await promise).toEqual([data]);
    });
});
