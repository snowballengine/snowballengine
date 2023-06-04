import { createModule } from "@snowballengine/core";
import { LogLevel, Logger } from "@snowballengine/utils";

export const LoggerModule = createModule("logger", [], (): Logger => new Logger(LogLevel.Info, console));
