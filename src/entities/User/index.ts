export interface UserData {
  gameName: string;
  tagLine: string;
  region: string;
  server: string;
  puuid: string;
  id: string;
  id_discord: string;
}

export interface ProfileUser {
  id: string;
  id_discord: string;
  champion?: string;
  skin?: number;
  color?: string;
}
