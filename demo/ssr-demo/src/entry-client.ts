import { startClient } from "@tempots/client";
import { App, Counter, IslandCounter } from "./app";

startClient({
  app: () => App(),
  islands: { Counter, IslandCounter },
  debug: true,
});
