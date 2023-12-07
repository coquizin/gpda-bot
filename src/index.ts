import { Client } from "discord.js";
import { config } from "./config/config";
import ready from "./events/ready";
import interactionCreate from "./events/interactionCreate";
import guildCreate from "./events/guildCreate";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages"],
});

ready(client);

guildCreate(client);

interactionCreate(client);

client.login(config.TOKEN);
