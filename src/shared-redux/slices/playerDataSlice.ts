import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { differenceInDays } from "date-fns";

const playerDataState = {
  playerId: "",
  arenaId: "",
  playerName: "",
  arenaVersion: "",
  tagsColors: {} as Record<string, string>,
  deckTags: {} as Record<string, string[]>,
  playerDbPath: "",
  appDbPath: "",
  lastLogTimestamp: "",
  lastLogFormat: "",
  cards: {
    cards_time: Date.now(),
    cards_before: {} as Record<string, number>,
    cards: {} as Record<string, number>
  },
  cardsNew: {} as Record<string, number>,
  economy: {
    gold: 0,
    gems: 0,
    vault: 0,
    wcTrack: 0,
    wcCommon: 0,
    wcUncommon: 0,
    wcRare: 0,
    wcMythic: 0,
    trackName: "",
    trackTier: 0,
    currentLevel: 0,
    currentExp: 0,
    currentOrbCount: 0,
    boosters: [] as number[]
  },
  rank: {
    constructed: {
      rank: "",
      tier: 0,
      step: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      percentile: 0,
      leaderboardPlace: 0,
      seasonOrdinal: 0
    },
    limited: {
      rank: "",
      tier: 0,
      step: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      percentile: 0,
      leaderboardPlace: 0,
      seasonOrdinal: 0
    }
  }
};

type PlayerData = typeof playerDataState;

const incrementCardCount = (state: PlayerData, grpId: number): void => {
  state.cards.cards[grpId] = state.cards.cards[grpId] + 1 || 1;
  state.cardsNew[grpId] = state.cardsNew[grpId] + 1 || 1;
};

const playerDataSlice = createSlice<PlayerData, SliceCaseReducers<PlayerData>>({
  name: "playerdata",
  initialState: playerDataState,
  reducers: {
    setPlayerId: (state: PlayerData, action): void => {
      state.arenaId = action.payload;
    },
    setPlayerName: (state: PlayerData, action): void => {
      state.playerName = action.payload;
    },
    setArenaVersion: (state: PlayerData, action): void => {
      state.arenaVersion = action.payload;
    },
    setRank: (state: PlayerData, action): void => {
      state.rank = action.payload;
    },
    setEconomy: (state: PlayerData, action): void => {
      Object.assign(state.economy, action.payload);
    },
    setTagColors: (state: PlayerData, action): void => {
      Object.assign(state.tagsColors, action.payload);
    },
    editTagColor: (state: PlayerData, action): void => {
      const { tag, color } = action.payload;
      state.tagsColors = { ...state.tagsColors, [tag]: color };
    },
    addCard: (state: PlayerData, action): void => {
      incrementCardCount(state, action.payload);
    },
    addCardsList: (state: PlayerData, action): void => {
      action.payload.forEach((grpId: number) => {
        incrementCardCount(state, grpId);
      });
    },
    addCardsKeys: (state: PlayerData, action): void => {
      const now = Date.now();
      const json = action.payload;
      const newCards = { ...state.cards };
      // Update if a day has passed
      if (differenceInDays(now, new Date(newCards.cards_time)) > 0) {
        newCards.cards_before = { ...newCards.cards };
        newCards.cards_time = now;
      }
      newCards.cards = json;
      // Get the diff on cardsNew
      Object.keys(json).forEach((key: string) => {
        if (newCards.cards_before[key] === undefined) {
          state.cardsNew[key] = json[key];
        } else if (newCards.cards_before[key] < json[key]) {
          state.cardsNew[key] = json[key] - newCards.cards_before[key];
        }
      });
      state.cards = newCards;
    },
    addCardsFromStore: (state: PlayerData, action): void => {
      Object.assign(state.cards, action.payload);
      const json = action.payload;
      const newCards = { ...state.cardsNew };
      Object.keys(json.cards).forEach((key: string) => {
        if (json.cards_before[key] === undefined) {
          newCards[key] = json.cards[key];
        } else if (json.cards_before[key] < json.cards[key]) {
          newCards[key] = json.cards[key] - json.cards_before[key];
        }
      });
      state.cardsNew = newCards;
    },
    addDeckTag: (state: PlayerData, action): void => {
      const { tag, deck } = action.payload;
      const tags = state.deckTags[deck] || [];
      if (tags.indexOf(tag) == -1) tags.push(tag);
      state.deckTags[deck] = tags;
    },
    removeDeckTag: (state: PlayerData, action): void => {
      const { tag, deck } = action.payload;
      const tags = state.deckTags[deck] || [];
      if (tags.includes(tag)) {
        tags.splice(tags.indexOf(tag), 1);
      }
      state.deckTags[deck] = tags;
    },
    setDeckTags: (state: PlayerData, action): void => {
      state.deckTags = action.payload;
    },
    setPlayerDb: (state: PlayerData, action): void => {
      state.playerDbPath = action.payload;
    },
    setAppDb: (state: PlayerData, action): void => {
      state.appDbPath = action.payload;
    }
  }
});

export default playerDataSlice;
