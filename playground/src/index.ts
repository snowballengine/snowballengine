import { createScene } from "@snowballengine/core";
import { LoggerModule, TickerModule } from "@snowballengine/modules";

const scene = createScene({
    modules: [LoggerModule, TickerModule]
});

scene.ticker.addListener("start", () => {
    console.log("start");
});

scene.ticker.addListener("beforeUpdate", () => {
    console.log("beforeUpdate");
});

scene.ticker.addListener("update", () => {
    console.log("update");
});

scene.ticker.addListener("afterUpdate", () => {
    console.log("afterUpdate");
});

scene.ticker.addListener("stop", () => {
    console.log("stop");
});

// @ts-ignore
window.scene = scene;
