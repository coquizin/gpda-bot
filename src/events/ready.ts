import { Client } from "discord.js";
import { config } from "../config/config";
import { deployCommands } from "../deploy-command";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    await deployCommands({ guildId: config.GUILD_ID });
    console.log(`${client.user.username} bot is ready! 🤖`);
  });
};
