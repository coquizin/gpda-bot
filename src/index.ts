import { Client } from "discord.js";
import ready from "@events/ready";
import guildCreate from "@events/guildCreate";
import interactionCreate from "@events/interactionCreate";
import { config } from "@config/config";
import { handleLoginSupabase } from "@service/supabase";

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "DirectMessages",
    "GuildMessageReactions",
  ],
});

ready(client);
handleLoginSupabase();

guildCreate(client);

interactionCreate(client);

client.login(config.TOKEN);
