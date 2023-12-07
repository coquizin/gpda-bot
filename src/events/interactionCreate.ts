import { Client } from "discord.js";
import { commands } from "src/commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      console.log("Interaction is not a command.");
      return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      commands[commandName as keyof typeof commands].execute(interaction);
    }
  });
};
