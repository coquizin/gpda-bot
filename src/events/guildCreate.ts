import { Client } from "discord.js";
import { deployCommands } from "../deploy-command";

export default (client: Client): void => {
  client.on("guildCreate", async (guild) => {
    console.log(`Joined guild ${guild.name} (${guild.id})!`);
    await deployCommands({ guildId: guild.id });
  });
};
