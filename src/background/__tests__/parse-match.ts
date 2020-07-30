/* eslint-env jest */
import {} from "../index";
import arenaLogWatcher from "../arena-log-watcher";
import globals from "../globals";
import path from "path";
import { playerDb, appDb } from "../../shared/db/LocalDatabase";
import globalStore from "../../shared/store";

const testLogPath = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "tests",
  "match-test.log"
);

playerDb.init("ABC123", "TesterMan#123456");
appDb.init("test-application");

function doStart(): Promise<void> {
  return new Promise((resolve, reject) => {
    globals.logReadStart = new Date(2020, 1, 1, 0, 0, 0, 0);
    arenaLogWatcher.start({
      path: testLogPath,
      chunkSize: 268435440,
      onLogEntry: arenaLogWatcher.onLogEntryFound,
      onError: (_err: any) => reject(),
      onFinish: resolve,
    });
  });
}

describe("parser", () => {
  it("parses a match consistently", async () => {
    await doStart();
    globalStore.currentMatch.beginTime = new Date("2020-07-30T17:17:34.719Z");
    expect(globalStore.currentMatch).toMatchSnapshot();
  });
});
