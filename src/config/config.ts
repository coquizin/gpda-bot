import dotenv from "dotenv";

dotenv.config();

const { TOKEN, CLIENT_ID, GUILD_ID_2, RIOT_API_KEY, GUILD_ID } = process.env;

if (!TOKEN || !CLIENT_ID || !GUILD_ID_2 || !RIOT_API_KEY) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID_2,
  RIOT_API_KEY,
  GUILD_ID,
};
