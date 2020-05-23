interface RankState {
    rank: string;
    tier: number;
    step: number;
    won: number;
    lost: number;
    drawn: number;
    percentile: number;
    leaderboardPlace: number;
    seasonOrdinal: number;
}

export interface GameState {
    playerId: string;
    arenaId: string;
    playerName: string;
    arenaVersion: string;
    tagsColors: Record<string, string>;
    deckTags: Record<string, string[]>;
    playerDbPath: string;
    appDbPath: string;
    lastLogTimestamp: string;
    lastLogFormat: string;
    cards: {
        cards_time: number;
        cards_before: Record<string, number>;
        cards: Record<string, number>
    };
    cardsNew: Record<string, number>;
    economy: {
        gold: number;
        gems: number;
        vault: number;
        wcTrack: number;
        wcCommon: number;
        wcUncommon: number;
        wcRare: number;
        wcMythic: number;
        trackName: string;
        trackTier: number;
        currentLevel: number;
        currentExp: number;
        currentOrbCount: number;
        boosters: number[]
    },
    rank: {
        constructed: RankState;
        limited: RankState;
    }
}