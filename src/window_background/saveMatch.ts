import { completeMatch } from "./data";
import globals from "./globals";
import { playerDb } from "../shared/db/LocalDatabase";
import { ipcSend } from "./backgroundUtil";
import { reduxAction } from "../shared-redux/sharedRedux";
import { IPC_RENDERER } from "../shared/constants";
import { getMatch } from "../shared-store";

export default function saveMatch(id: string, matchEndTime: number): void {
  //console.log(globals.currentMatch.matchId, id);
  if (
    !globals.currentMatch ||
    !globals.currentMatch.matchTime ||
    globals.currentMatch.matchId !== id
  ) {
    return;
  }

  const existingMatch = getMatch(id) || {};
  const match = completeMatch(
    existingMatch,
    globals.currentMatch,
    matchEndTime
  );
  if (!match) {
    return;
  }

  // console.log("Save match:", match);
  const matches_index = [...globals.store.getState().matches.matchesIndex];
  reduxAction(globals.store.dispatch, "SET_MATCH", match, IPC_RENDERER);
  playerDb.upsert("", id, match);
  if (globals.matchCompletedOnGameNumber === globals.gameNumberCompleted) {
    const httpApi = require("./httpApi");
    httpApi.httpSetMatch(match);
  }
  if (matches_index.indexOf(id) == -1) {
    matches_index.push(id);
    playerDb.upsert("", "matches_index", matches_index);
  }
  ipcSend("popup", { text: "Match saved!", time: 3000 });
}
