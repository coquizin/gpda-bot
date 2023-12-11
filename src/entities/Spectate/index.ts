interface BannedChampion {
  pickTurn: number;
  championId: number;
  teamId: number;
}

interface Observer {
  encryptionKey: string;
}

interface Perks {
  perkIds: number[];
  perkStyle: number;
  perkSubStyle: number;
}

interface GameCustomizationObject {
  category: string;
  content: string;
}

export interface CurrentGameParticipant {
  championId: number;
  perks: Perks;
  profileIconId: number;
  bot: boolean;
  teamId: number;
  summonerName: string;
  summonerId: string;
  spell1Id: number;
  spell2Id: number;
  gameCustomizationObjects: GameCustomizationObject[];
}

export interface CurrentGameInfo {
  gameId: number;
  gameType: string;
  gameStartTime: number;
  mapId: number;
  gameLength: number;
  platformId: string;
  gameMode: string;
  bannedChampions: BannedChampion[];
  gameQueueConfigId: number;
  observers: Observer;
  participants: CurrentGameParticipant[];
}

interface BannedChampion {
  pickTurn: number;
  championId: number;
  teamId: number;
}

interface Observer {
  encryptionKey: string;
}

interface Participant {
  bot: boolean;
  spell2Id: number;
  profileIconId: number;
  summonerName: string;
  championId: number;
  teamId: number;
  spell1Id: number;
}

interface FeaturedGameInfo {
  gameMode:
    | "CLASSIC"
    | "ODIN"
    | "ARAM"
    | "TUTORIAL"
    | "ONEFORALL"
    | "ASCENSION"
    | "FIRSTBLOOD"
    | "KINGPORO";
  gameLength: number;
  mapId: number;
  gameType: "CUSTOM_GAME" | "MATCHED_GAME" | "TUTORIAL_GAME";
  bannedChampions: BannedChampion[];
  gameId: number;
  observers: Observer;
  gameQueueConfigId: number;
  gameStartTime: number;
  participants: Participant[];
  platformId: string;
}

export interface FeaturedGames {
  gameList: FeaturedGameInfo[];
  clientRefreshInterval: number;
}
