import { expect, mergeTests } from "@playwright/test";
import { gameTest } from "./game";
import { loginTest } from "./login";

const test = mergeTests(loginTest, gameTest);

export { expect, test };
