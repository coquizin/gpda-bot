import dotenv from "dotenv";

dotenv.config();

const {
  TOKEN,
  CLIENT_ID,
  GUILD_ID_2,
  RIOT_API_KEY,
  GUILD_ID,
  SUPABASE_URL,
  SUPABASE_KEY,
  JWT_SECRET,
  EMAIL,
  SENHA,
} = process.env;

if (
  !TOKEN ||
  !CLIENT_ID ||
  !GUILD_ID_2 ||
  !RIOT_API_KEY ||
  !GUILD_ID ||
  !SUPABASE_URL ||
  !SUPABASE_KEY ||
  !JWT_SECRET ||
  !EMAIL ||
  !SENHA
) {
  throw new Error("Missing environment variables");
}

export const config = {
  TOKEN,
  CLIENT_ID,
  GUILD_ID_2,
  RIOT_API_KEY,
  GUILD_ID,
  SUPABASE_URL,
  SUPABASE_KEY,
  JWT_SECRET,
  EMAIL,
  SENHA,
};
