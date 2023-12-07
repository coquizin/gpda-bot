let userRiotData: Record<string, UserData> = {};

export interface UserData {
  gameName: string;
  tagLine: string;
  region: string;
  server: string;
  puuid: string;
}

const userData = {
  getUserData: function (): Record<string, UserData> {
    return userRiotData;
  },
  setUserData: function (userId: string, data: UserData): void {
    userRiotData[userId] = data;
  },
};

export default userData;
