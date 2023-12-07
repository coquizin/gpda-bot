import { Client } from "discord.js";
import { config } from "src/config/config";
import { deployCommands } from "src/deploy-command";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    await deployCommands({ guildId: config.GUILD_ID_2 });
    console.log(`${client.user.username} bot is ready! 🤖`);
  });
};
