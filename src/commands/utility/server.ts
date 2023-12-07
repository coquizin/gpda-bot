import { SlashCommandBuilder, CommandInteraction, Guild } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("server")
  .setDescription("Provides information about the server.");

export async function execute(interaction: CommandInteraction) {
  const guild = interaction.guild as Guild | null;

  if (guild) {
    await interaction.reply(
      `This server is ${guild.name} and has ${guild.memberCount} members. <3`
    );
  } else {
    await interaction.reply("This command can only be used in a server.");
  }
}
