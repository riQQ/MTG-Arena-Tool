import { createSlice } from "@reduxjs/toolkit";

type MulliganType =
  | "MulliganType_None"
  | "MulliganType_Paris"
  | "MulliganType_Vancouver"
  | "MulliganType_London";

type SuperFormat =
  | "SuperFormat_Constructed"
  | "SuperFormat_Limited"
  | "SuperFormat_None";

type GameType =
  | "GameType_None"
  | "GameType_Duel"
  | "GameType_MultiPlayer"
  | "GameType_Solitaire";

type MatchScope = "MatchScope_None" | "MatchScope_Game" | "MatchScope_Match";
type ResultType =
  | "ResultType_None"
  | "ResultType_Suspended"
  | "ResultType_Draw"
  | "ResultType_WinLoss";

type ResultReason =
  | "ResultReason_None"
  | "ResultReason_Game"
  | "ResultReason_Concede"
  | "ResultReason_Timeout"
  | "ResultReason_Loop"
  | "ResultReason_Force";

interface Result {
  scope: MatchScope;
  result: ResultType;
  winningTeamId: 0;
  reason: ResultReason;
}

type Phase =
  | "Phase_None"
  | "Phase_Beginning"
  | "Phase_Main1"
  | "Phase_Combat"
  | "Phase_Main2"
  | "Phase_Ending";

type Step =
  | "Step_None"
  | "Step_Untap"
  | "Step_Upkeep"
  | "Step_Draw"
  | "Step_BeginCombat"
  | "Step_DeclareAttack"
  | "Step_DeclareBlock"
  | "Step_CombatDamage"
  | "Step_EndCombat"
  | "Step_End"
  | "Step_Cleanup"
  | "Step_FirstStrikeDamage";

type GameVariant =
  | "GameVariant_None"
  | "GameVariant_Normal"
  | "GameVariant_Planechase"
  | "GameVariant_Vanguard"
  | "GameVariant_Commander"
  | "GameVariant_Archenemy"
  | "GameVariant_TeamVsTeam"
  | "GameVariant_TwoHeadedGiant"
  | "GameVariant_Brawl"
  | "GameVariant_Placeholder1"
  | "GameVariant_Placeholder2"
  | "GameVariant_Placeholder3"
  | "GameVariant_Placeholder4"
  | "GameVariant_Placeholder5";

type MatchWinCondition =
  | "MatchWinCondition_None"
  | "MatchWinCondition_SingleElimination"
  | "MatchWinCondition_Best2of3"
  | "MatchWinCondition_Best3of5";

type ClientMessageType =
  | "ClientMessageType_None"
  | "ClientMessageType_ConnectReq"
  | "ClientMessageType_CancelActionReq"
  | "ClientMessageType_ChooseModalResp"
  | "ClientMessageType_ConcedeReq"
  | "ClientMessageType_EnterSideboardingReq"
  | "ClientMessageType_ForceDrawReq"
  | "ClientMessageType_GetSettingsReq"
  | "ClientMessageType_GroupResp"
  | "ClientMessageType_MulliganResp"
  | "ClientMessageType_OrderResp"
  | "ClientMessageType_PerformActionResp"
  | "ClientMessageType_ControlReq"
  | "ClientMessageType_SelectNResp"
  | "ClientMessageType_SetSettingsReq"
  | "ClientMessageType_UndoReq"
  | "ClientMessageType_ChooseStartingPlayerResp"
  | "ClientMessageType_OptionalActionResp"
  | "ClientMessageType_AllowForceDrawResp"
  | "ClientMessageType_RevealHandResp"
  | "ClientMessageType_DeclareAttackersResp"
  | "ClientMessageType_SubmitAttackersReq"
  | "ClientMessageType_DeclareBlockersResp"
  | "ClientMessageType_SubmitBlockersReq"
  | "ClientMessageType_OrderCombatDamageResp"
  | "ClientMessageType_AssignDamageResp"
  | "ClientMessageType_SelectTargetsResp"
  | "ClientMessageType_SubmitTargetsReq"
  | "ClientMessageType_DrawCardResp"
  | "ClientMessageType_SelectReplacementResp"
  | "ClientMessageType_SelectNGroupResp"
  | "ClientMessageType_DistributionResp"
  | "ClientMessageType_NumericInputResp"
  | "ClientMessageType_SearchResp"
  | "ClientMessageType_ActionCostResp"
  | "ClientMessageType_CastingTimeOptionsResp"
  | "ClientMessageType_SelectManaTypeResp"
  | "ClientMessageType_SelectFromGroupsResp"
  | "ClientMessageType_SearchFromGroupsResp"
  | "ClientMessageType_GatherResp"
  | "ClientMessageType_SubmitPaymentResp"
  | "ClientMessageType_AutoResp"
  | "ClientMessageType_UIMessage"
  | "ClientMessageType_SubmitDeckResp"
  | "ClientMessageType_TakeTimeoutReq"
  | "ClientMessageType_PerformAutoTapActionsResp";

type ControllerType =
  | "ControllerType_None"
  | "ControllerType_Player"
  | "ControllerType_AI"
  | "ControllerType_AI_Goldfish"
  | "ControllerType_AI_PetRock";

interface PlayerInfo {
  lifeTotal: number;
  systemSeatNumber: number;
  maxHandSize: number;
  mulliganCount: number;
  turnNumber: number;
  teamId: number;
  timerIds: number[];
  controllerSeatId: number;
  controllerType: ControllerType;
  timeoutCount: number;
  pipCount: number;
  pendingMessageType: ClientMessageType;
  startingLifeTotal: number;
}

const currentMatchSlice = createSlice({
  name: "currentMatch",
  initialState: {
    players: [] as PlayerInfo[],
    turnInfo: {
      phase: "Phase_None" as Phase,
      step: "Step_None" as Step,
      turnNumber: 0,
      activePlayer: 0,
      priorityPlayer: 0,
      decisionPlayer: 0,
      stormCount: 0,
      nextPhase: "Phase_None" as Phase,
      nextStep: "Step_None" as Step
    },
    gameType: "GameType_None" as GameType,
    gameNumber: 0,
    gameVariant: "GameVariant_None" as GameVariant,
    results: [] as Result[],
    mulliganType: "MulliganType_None" as MulliganType,
    superFormat: "SuperFormat_None" as SuperFormat,
    matchWinCondition: "MatchWinCondition_None" as MatchWinCondition,
    deckConstraintInfo: {
      minDeckSize: 0,
      maxDeckSize: 0,
      minSideboardSize: 0,
      maxSideboardSize: 0,
      minCommanderSize: 0,
      maxCommanderSize: 0
    }
  },
  reducers: {
    setFormat: (state, action): void => {
      state.superFormat = action.payload;
    }
  }
});

export default currentMatchSlice;
