import { Client } from "discord.js";
import { commands } from "src/commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      const { commandName } = interaction;
      if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
      }

      if (commandName === "react") {
        const message = await interaction.reply({
          content: "You can react with Unicode emojis!",
          fetchReply: true,
        });
        message.react("😄");
      }
    }

    if (interaction.isButton()) {
      // console.log("interaction");
    }
  });
};
